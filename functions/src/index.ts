import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios, { AxiosResponse } from 'axios';
import { DocumentData, DocumentReference, DocumentSnapshot, QuerySnapshot } from 'firebase-admin/firestore';
import { ParticipationDTO, EventDTO, TableDTO, AssignmentDTO, ClientDTO } from './collection';
import { Participation, ShorterUrlResponse, SMS, SMSResponse, SMSSearchInfo, SMSSend } from './type';
import { SMSStatusType } from './enum';
import { logger } from 'firebase-functions';
import { debug } from 'firebase-functions/logger';

import { onRequest } from 'firebase-functions/v2/https';

admin.initializeApp();

/* -------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------- TEST --------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------- */
const client = new admin.firestore.v1.FirestoreAdminClient();
const bucket = 'gs://enjoy-network-backup';

export const scheduledFirestoreExport = functions.pubsub
  .schedule('0 0 * * 1,3,5')
  .timeZone('Europe/Rome')
  .onRun((context) => {
    // set timezone
    process.env.TZ = 'Europe/Rome';

    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;

    if (!projectId) {
      logger.error('GCP_PROJECT / GCLOUD_PROJECT environment variables not set.');
      throw new Error('GCP_PROJECT / GCLOUD_PROJECT environment variables not set.');
    }

    const databaseName = client.databasePath(projectId, '(default)');

    return client
      .exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        // Leave collectionIds empty to export all collections or set to a list of collection IDs to export,
        // collectionIds: ['users', 'posts']
        collectionIds: [
          'PROD_assignments',
          'PROD_clients',
          'PROD_employees',
          'PROD_events',
          'PROD_participations',
          'PROD_tables'
        ]
      })
      .then((responses) => {
        const response = responses[0];
        debug(`Operation Name: ${response['name']}`);
        return;
      })
      .catch((err) => {
        logger.error(err);
        throw new Error('Export operation failed');
      });
  });

/* -------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------- TEST --------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------- */
export const z_participatiOnCreate = functions.firestore
  .document('participations/{participationId}')
  .onCreate(async (snap, context) => {
    const participationDTO = snap.data() as ParticipationDTO;

    try {
      /* -------------------------------------------------------- Get table -------------------------------------------------------- */
      const table = await admin.firestore().doc(`tables/${participationDTO.tableUid}`).get();
      const tableDTO = table.data() as TableDTO;
      const { eventUid, employeeUid } = tableDTO;

      /* -------------------------------------------------------- Get assignment -------------------------------------------------------- */
      const assignmentDocument = await admin
        .firestore()
        .collection('assignments')
        .where('eventUid', '==', eventUid)
        .where('employeeUid', '==', employeeUid)
        .get();

      /* -------------------------------------------------------- Increment personsMarked in assignment -------------------------------------------------------- */
      const assignmentUid = assignmentDocument.docs[0].id as string;
      await admin
        .firestore()
        .doc(`assignments/${assignmentUid}`)
        .update({
          personMarked: admin.firestore.FieldValue.increment(1),
          modifiedAt: new Date()
        });

      /* -------------------------------------------------------- Increment personsTotal e personsActive in table -------------------------------------------------------- */
      const { tableUid } = participationDTO;
      await admin
        .firestore()
        .doc(`tables/${tableUid}`)
        .update({
          personsTotal: admin.firestore.FieldValue.increment(1),
          personsActive: admin.firestore.FieldValue.increment(1),
          modifiedAt: new Date()
        });
    } catch (error) {
      logger.error(error);
    }
  });

export const z_participatiOnUpdate = functions.firestore
  .document('participations/{participationId}')
  .onUpdate(async (change, context) => {
    try {
      const participationUid = context.params.participationId;
      const data = change.after.data() as ParticipationDTO;
      const previousData = change.before.data() as ParticipationDTO;

      if (data.isActive === previousData.isActive && data.isScanned === previousData.isScanned) {
        return;
      }

      const { tableUid, isScanned, isActive } = data;
      const valueIsScanned = isScanned ? 1 : -1;
      const valueIsActive = isActive ? 1 : -1;

      /* -------------------------------------------------------- Update assignment -------------------------------------------------------- */
      const table = await admin.firestore().doc(`tables/${tableUid}`).get();
      const tableDTO = table.data() as TableDTO;
      const { eventUid, employeeUid } = tableDTO;

      if (data.isActive !== previousData.isActive) {
        const assignmentDocument = await admin
          .firestore()
          .collection('assignments')
          .where('eventUid', '==', eventUid)
          .where('employeeUid', '==', employeeUid)
          .get();

        const assignmentUid = assignmentDocument.docs[0].id as string;
        await admin
          .firestore()
          .doc(`assignments/${assignmentUid}`)
          .update({
            personMarked: admin.firestore.FieldValue.increment(valueIsActive),
            modifiedAt: new Date()
          });
      }

      /* -------------------------------------------------------- Update table -------------------------------------------------------- */
      if (data.isActive !== previousData.isActive) {
        await admin
          .firestore()
          .doc(`tables/${tableUid}`)
          .update({
            personsActive: admin.firestore.FieldValue.increment(valueIsActive),
            modifiedAt: new Date()
          });
      } else if (data.isScanned !== previousData.isScanned) {
        await admin
          .firestore()
          .doc(`tables/${tableUid}`)
          .update({
            personsScanned: admin.firestore.FieldValue.increment(valueIsScanned),
            modifiedAt: new Date()
          });

        if (!data.messageIsReceived) {
          await admin.firestore().doc(`participations/${participationUid}`).update({
            messageIsReceived: true,
            modifiedAt: new Date()
          });
        }
      }
    } catch (error) {
      logger.error(error);
    }
  });

export const z_participatiOnDelete = functions.firestore
  .document('participations/{participationId}')
  .onDelete(async (snap) => {
    try {
      /* Reduce table */
      const participationDTO = snap.data() as ParticipationDTO;
      const { tableUid, isScanned, isActive } = participationDTO;
      const valueIsScanned = isScanned ? -1 : 0;
      const valueIsActive = isActive ? -1 : 0;
      await admin
        .firestore()
        .doc(`tables/${tableUid}`)
        .update({
          personsTotal: admin.firestore.FieldValue.increment(-1),
          personsActive: admin.firestore.FieldValue.increment(valueIsActive),
          personsScanned: admin.firestore.FieldValue.increment(valueIsScanned),
          modifiedAt: new Date()
        });

      /* Reduce assignment */
      const table = await admin.firestore().doc(`tables/${tableUid}`).get();
      const tableDTO = table.data() as TableDTO;
      const { eventUid, employeeUid } = tableDTO;

      const assignmentDocument = await admin
        .firestore()
        .collection('assignments')
        .where('eventUid', '==', eventUid)
        .where('employeeUid', '==', employeeUid)
        .get();

      if (assignmentDocument.docs.length === 0) return;

      const assignmentUid = assignmentDocument.docs[0].id as string;
      await admin
        .firestore()
        .doc(`assignments/${assignmentUid}`)
        .update({
          personMarked: admin.firestore.FieldValue.increment(valueIsActive),
          modifiedAt: new Date()
        });
    } catch (error) {
      logger.error(error);
    }
  });

export const z_assignmentOnUpdate = functions.firestore.document('assignments/{assignmentId}').onUpdate((change) => {
  try {
    const data = change.after.data() as AssignmentDTO;
    const previousData = change.before.data() as AssignmentDTO;

    if (data.isActive === previousData.isActive) {
      return;
    }

    const { isActive, personMarked } = data;

    if (!isActive) {
      if (personMarked > 0) {
        const propsToUpdate = {
          personMarkable: personMarked,
          modifiedAt: new Date()
        };
        return change.after.ref.set(propsToUpdate, { merge: true });
      } else {
        return change.after.ref.delete();
      }
    } else {
      return change.after.ref;
    }
  } catch (error) {
    logger.error(error);
    return null;
  }
});

export const z_clientOnUpdate = functions.firestore.document('clients/{clientId}').onUpdate(async (change) => {
  try {
    const data = change.after.data() as ClientDTO;
    const { name, lastName, phone } = data;

    const participations = await admin.firestore().collection('participations').where('phone', '==', phone).get();

    const batch = admin.firestore().batch();
    participations.forEach((participation) => {
      const document: DocumentReference<DocumentData> = admin.firestore().doc(`participations/${participation.id}`);
      batch.update(document, { name: name, lastName: lastName, modifiedAt: new Date() });
    });
    await batch.commit();
  } catch (error) {
    logger.error(error);
  }
});

export const z_clientOnDelete = functions.firestore.document('clients/{clientId}').onDelete(async (snapshot) => {
  try {
    const data = snapshot.data() as ClientDTO;
    const { phone } = data;

    const participations = await admin.firestore().collection('participations').where('phone', '==', phone).get();

    const batch = admin.firestore().batch();
    participations.forEach((participation) => {
      const document: DocumentReference<DocumentData> = admin.firestore().doc(`participations/${participation.id}`);
      batch.update(document, { isActive: false, modifiedAt: new Date() });
    });
    await batch.commit();
  } catch (error) {
    logger.error(error);
  }
});

export const z_visibilityChange = functions.https.onRequest(async (request, response) => {
  // try {
  //   const participations = request.body.participations as Participation[];

  //   const batch = admin.firestore().batch();

  //   participations.forEach(async (participation) => {
  //     const document: DocumentReference<DocumentData> = admin.firestore().doc(`participations/${participation.uid}`);

  //     batch.update(document, participation.props);
  //   });

  //   await batch.commit();

  //   response.send('ok');
  // } catch (error) {
  // logger.error(error);
  // response.status(500).send('Errore, contattare staffer');
  // }
  try {
    const participation = request.query.participation as string;
    const scannedFrom = request.query.scannedFrom as string;

    const document: DocumentSnapshot<DocumentData> = await admin
      .firestore()
      .doc(`participations/${participation}`)
      .get();

    if (!document.exists) {
      response.send('not found');
      return;
    }

    const participationDTO = document.data() as ParticipationDTO;
    participationDTO.isScanned = true;
    participationDTO.scannedAt = new Date();
    participationDTO.scannedFrom = scannedFrom;
    participationDTO.modifiedAt = new Date();

    await admin.firestore().doc(`participations/${participation}`).update(participationDTO);

    // res send 200
    response.send('Partecipazioni scannerizzate');
  } catch (error) {
    logger.error(error);
    response.status(500).send('Errore, contattare staffer');
  }
});

/* -------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------- PROD --------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------- */
export const sendSms = functions.firestore
  .document('PROD_participations/{participationId}')
  .onCreate(async (snap, context) => {
    const participationUid = context.params.participationId;
    const participationDTO = snap.data() as ParticipationDTO;
    const { eventUid, tableUid, name, phone } = participationDTO;

    try {
      /*  Get event  */
      const document: DocumentData = await admin.firestore().doc(`PROD_events/${eventUid}`).get();
      const eventDTO = document.data() as EventDTO;
      const { message } = eventDTO;

      /* Send sms */
      await sendSMS(participationUid, name, phone, eventUid, message, tableUid);
    } catch (error) {
      logger.error(error);
    }
  });

export const receiveSms_v2 = onRequest({ cors: true }, async (request, response) => {
  try {
    const { transactionId, to, status } = request.body;

    const phoneWithNoPrefix = (to as string).startsWith('39') ? (to as string).substring(2) : to;

    if (status === SMSStatusType.DELIVERED) {
      const document: DocumentData = await admin
        .firestore()
        .collection('PROD_participations')
        .where('eventUid', '==', transactionId)
        .where('phone', '==', phoneWithNoPrefix)
        .get();

      if (document.empty) {
        response.send('Not found');
        return;
      }

      document.docs[0].ref.update({
        messageIsReceived: true,
        statusSMS: SMSStatusType.DELIVERED,
        modifiedAt: new Date()
      });
    }

    response.send('ok');
  } catch (error) {
    logger.error(error);
    response.status(500).send('Errore, contattare staffer');
  }
});

export const participatiOnCreate = functions.firestore
  .document('PROD_participations/{participationId}')
  .onCreate(async (snap, context) => {
    const participationDTO = snap.data() as ParticipationDTO;

    try {
      /* -------------------------------------------------------- Get table -------------------------------------------------------- */
      const table = await admin.firestore().doc(`PROD_tables/${participationDTO.tableUid}`).get();
      const tableDTO = table.data() as TableDTO;
      const { eventUid, employeeUid } = tableDTO;

      /* -------------------------------------------------------- Get assignment -------------------------------------------------------- */
      const assignmentDocument = await admin
        .firestore()
        .collection('PROD_assignments')
        .where('eventUid', '==', eventUid)
        .where('employeeUid', '==', employeeUid)
        .get();

      /* -------------------------------------------------------- Increment personsMarked in assignment -------------------------------------------------------- */
      const assignmentUid = assignmentDocument.docs[0].id as string;
      await admin
        .firestore()
        .doc(`PROD_assignments/${assignmentUid}`)
        .update({
          personMarked: admin.firestore.FieldValue.increment(1),
          modifiedAt: new Date()
        });

      /* -------------------------------------------------------- Increment personsTotal e personsActive in table -------------------------------------------------------- */
      const { tableUid } = participationDTO;
      await admin
        .firestore()
        .doc(`PROD_tables/${tableUid}`)
        .update({
          personsTotal: admin.firestore.FieldValue.increment(1),
          personsActive: admin.firestore.FieldValue.increment(1),
          modifiedAt: new Date()
        });
    } catch (error) {
      logger.error(error);
    }
  });

export const participatiOnUpdate = functions.firestore
  .document('PROD_participations/{participationId}')
  .onUpdate(async (change, context) => {
    try {
      const participationUid = context.params.participationId;
      const data = change.after.data() as ParticipationDTO;
      const previousData = change.before.data() as ParticipationDTO;

      if (data.isActive === previousData.isActive && data.isScanned === previousData.isScanned) {
        return;
      }

      const { tableUid, isScanned, isActive } = data;
      const valueIsScanned = isScanned ? 1 : -1;
      const valueIsActive = isActive ? 1 : -1;

      /* -------------------------------------------------------- Update assignment -------------------------------------------------------- */
      const table = await admin.firestore().doc(`PROD_tables/${tableUid}`).get();
      const tableDTO = table.data() as TableDTO;
      const { eventUid, employeeUid } = tableDTO;

      if (data.isActive !== previousData.isActive) {
        const assignmentDocument = await admin
          .firestore()
          .collection('PROD_assignments')
          .where('eventUid', '==', eventUid)
          .where('employeeUid', '==', employeeUid)
          .get();

        const assignmentUid = assignmentDocument.docs[0].id as string;
        await admin
          .firestore()
          .doc(`PROD_assignments/${assignmentUid}`)
          .update({
            personMarked: admin.firestore.FieldValue.increment(valueIsActive),
            modifiedAt: new Date()
          });
      }

      /* -------------------------------------------------------- Update table -------------------------------------------------------- */
      if (data.isActive !== previousData.isActive) {
        await admin
          .firestore()
          .doc(`PROD_tables/${tableUid}`)
          .update({
            personsActive: admin.firestore.FieldValue.increment(valueIsActive),
            modifiedAt: new Date()
          });
      } else if (data.isScanned !== previousData.isScanned) {
        await admin
          .firestore()
          .doc(`PROD_tables/${tableUid}`)
          .update({
            personsScanned: admin.firestore.FieldValue.increment(valueIsScanned),
            modifiedAt: new Date()
          });

        if (!data.messageIsReceived) {
          await admin.firestore().doc(`PROD_participations/${participationUid}`).update({
            messageIsReceived: true,
            modifiedAt: new Date()
          });
        }
      }
    } catch (error) {
      logger.error(error);
    }
  });

export const participatiOnDelete = functions.firestore
  .document('PROD_participations/{participationId}')
  .onDelete(async (snap) => {
    try {
      /* Reduce table */
      const participationDTO = snap.data() as ParticipationDTO;
      const { tableUid, isScanned, isActive } = participationDTO;
      const valueIsScanned = isScanned ? -1 : 0;
      const valueIsActive = isActive ? -1 : 0;
      await admin
        .firestore()
        .doc(`PROD_tables/${tableUid}`)
        .update({
          personsTotal: admin.firestore.FieldValue.increment(-1),
          personsActive: admin.firestore.FieldValue.increment(valueIsActive),
          personsScanned: admin.firestore.FieldValue.increment(valueIsScanned),
          modifiedAt: new Date()
        });

      /* Reduce assignment */
      const table = await admin.firestore().doc(`PROD_tables/${tableUid}`).get();
      const tableDTO = table.data() as TableDTO;
      const { eventUid, employeeUid } = tableDTO;

      const assignmentDocument = await admin
        .firestore()
        .collection('PROD_assignments')
        .where('eventUid', '==', eventUid)
        .where('employeeUid', '==', employeeUid)
        .get();

      if (assignmentDocument.docs.length === 0) return;

      const assignmentUid = assignmentDocument.docs[0].id as string;
      await admin
        .firestore()
        .doc(`PROD_assignments/${assignmentUid}`)
        .update({
          personMarked: admin.firestore.FieldValue.increment(valueIsActive),
          modifiedAt: new Date()
        });
    } catch (error) {
      logger.error(error);
    }
  });

export const assignmentOnUpdate = functions.firestore.document('PROD_assignments/{assignmentId}').onUpdate((change) => {
  try {
    const data = change.after.data() as AssignmentDTO;
    const previousData = change.before.data() as AssignmentDTO;

    if (data.isActive === previousData.isActive) {
      return;
    }

    const { isActive, personMarked } = data;

    if (!isActive) {
      if (personMarked > 0) {
        const propsToUpdate = {
          personMarkable: personMarked,
          modifiedAt: new Date()
        };
        return change.after.ref.set(propsToUpdate, { merge: true });
      } else {
        return change.after.ref.delete();
      }
    } else {
      return change.after.ref;
    }
  } catch (error) {
    logger.error(error);
    return null;
  }
});

export const clientOnUpdate = functions.firestore.document('PROD_clients/{clientId}').onUpdate(async (change) => {
  try {
    const data = change.after.data() as ClientDTO;
    const { name, lastName, phone } = data;

    const participations = await admin.firestore().collection('PROD_participations').where('phone', '==', phone).get();

    const batch = admin.firestore().batch();
    participations.forEach((participation) => {
      const document: DocumentReference<DocumentData> = admin
        .firestore()
        .doc(`PROD_participations/${participation.id}`);
      batch.update(document, { name: name, lastName: lastName, modifiedAt: new Date() });
    });
    await batch.commit();
  } catch (error) {
    logger.error(error);
  }
});

export const clientOnDelete = functions.firestore.document('PROD_clients/{clientId}').onDelete(async (snapshot) => {
  try {
    const data = snapshot.data() as ClientDTO;
    const { phone } = data;

    const participations = await admin.firestore().collection('PROD_participations').where('phone', '==', phone).get();

    const batch = admin.firestore().batch();
    participations.forEach((participation) => {
      const document: DocumentReference<DocumentData> = admin
        .firestore()
        .doc(`PROD_participations/${participation.id}`);
      batch.update(document, { isActive: false, modifiedAt: new Date() });
    });
    await batch.commit();
  } catch (error) {
    console.error(JSON.stringify(error));
  }
});

export const visibilityChange = functions.https.onRequest(async (request, response) => {
  // try {
  //   const participations = request.body.participations as Participation[];

  //   const batch = admin.firestore().batch();

  //   participations.forEach(async (participation) => {
  //     const document: DocumentReference<DocumentData> = admin.firestore().doc(`participations/${participation.uid}`);

  //     batch.update(document, participation.props);
  //   });

  //   await batch.commit();

  //   response.send('ok');
  // } catch (error) {
  // logger.error(error);
  // response.status(500).send('Errore, contattare staffer');
  // }
  try {
    const participation = request.query.participation as string;
    const scannedFrom = request.query.scannedFrom as string;

    const document: DocumentSnapshot<DocumentData> = await admin
      .firestore()
      .doc(`PROD_participations/${participation}`)
      .get();

    if (!document.exists) {
      response.send('not found');
      return;
    }

    const participationDTO = document.data() as ParticipationDTO;
    participationDTO.isScanned = true;
    participationDTO.scannedAt = new Date();
    participationDTO.scannedFrom = scannedFrom;
    participationDTO.modifiedAt = new Date();

    await admin.firestore().doc(`PROD_participations/${participation}`).update(participationDTO);

    // res send 200
    response.send('Partecipazioni scannerizzate');
  } catch (error) {
    logger.error(error);
    response.status(500).send('Errore, contattare staffer');
  }
});

// export const scheduleMessageIsReceived = functions.pubsub
//   .schedule('0 0,9,12,15,18,21 * * *')
//   .timeZone('Europe/Rome')
//   .onRun(async (context) => {
//     try {
//       /* General */
//       const oneHourAndHalfAgo = new Date(new Date().getTime() - 1.5 * 60 * 60 * 1000);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//
//       /* Get events */
//       const eventDocuments: QuerySnapshot<DocumentData> = await admin
//         .firestore()
//         .collection('PROD_events')
//         .where('date', '>=', today)
//         .get();
//       const futureEvents = eventDocuments.docs.map((event) => {
//         const eventDTO = event.data() as EventDTO;
//         return { uid: event.id, props: eventDTO };
//       });
//       debug(futureEvents);
//
//       /* Get participations */
//       const participations: Participation[] = [];
//       const participationDocuments: QuerySnapshot<DocumentData> = await admin
//         .firestore()
//         .collection('PROD_participations')
//         .where('isActive', '==', true)
//         .where('isScanned', '==', false)
//         .where('messageIsReceived', '==', false)
//         .where('messageAttempt', '<', 4)
//         .where(
//           'eventUid',
//           'in',
//           futureEvents.map((event) => event.uid)
//         )
//         .get();
//       participationDocuments.forEach((participation) => {
//         const participationDTO = participation.data() as ParticipationDTO;
//         participations.push({ uid: participation.id, props: participationDTO });
//       });
//
//       /* Send sms for all participations that have not received the message in the last 2 hours */
//       /* Date filter here because in firestore isn't possible execute query with inequality on two fields */
//       futureEvents.forEach((event) => {
//         const { message } = event.props;
//         const participationsToResendSMS: Participation[] = participations.filter(
//           (participation) =>
//             participation.props.eventUid === event.uid &&
//             participation.props.modifiedAt &&
//             new Date((participation.props.modifiedAt as unknown as Timestamp).seconds * 1000).getTime() <
//               oneHourAndHalfAgo.getTime()
//         );
//         debug(event.props.name);
//         debug(participationsToResendSMS);
//
//         participationsToResendSMS.forEach(async (participation) => {
//           const { name, phone, eventUid, tableUid } = participation.props;
//           await sendSMS(participation.uid, name, phone, eventUid, message, tableUid);
//         });
//       });
//     } catch (error) {
//       logger.error(error);
//     }
//   });

export const scheduleMessageIsReceived = functions.pubsub
  .schedule('0 0,9,12,15,18,21 * * *')
  .timeZone('Europe/Rome')
  .onRun(async (context) => {
    /* Headers */
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const credentials = btoa(`${username}:${password}`);
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`
    };

    /* General */
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneHourAndHalfAgo = new Date();
    oneHourAndHalfAgo.setHours(oneHourAndHalfAgo.getHours() - 1);
    oneHourAndHalfAgo.setMinutes(oneHourAndHalfAgo.getMinutes() - 30);

    try {
      /* Get events */
      const eventDocuments: QuerySnapshot<DocumentData> = await admin
        .firestore()
        .collection('PROD_events')
        .where('date', '>=', today)
        .get();
      const futureEvents = eventDocuments.docs.map((event) => {
        const eventDTO = event.data() as EventDTO;
        return { uid: event.id, props: eventDTO };
      });
      debug(futureEvents.map((event) => event.props.name));

      futureEvents.forEach(async (event) => {
        const smsSentUrl = `https://api.smshosting.it/rest/api/sms/search?transactionId=${event.uid}&limit=1000`;
        const smsSentResponse: AxiosResponse<SMSSend, any> = await axios.get(smsSentUrl, { headers });
        const data = smsSentResponse.data;

        /* Sms delivered */
        const smsDelivered: SMSSearchInfo[] = data.smsList.filter((sms) => sms.status === SMSStatusType.DELIVERED);
        debug(`Messaggi consegnati per ${event.props.name}: ${smsDelivered.length}`);

        /* Sms not delivered */
        const smsNotDelivered: SMSSearchInfo[] = data.smsList.filter(
          (sms) => sms.status === SMSStatusType.NOT_DELIVERED
        );
        debug(`Messaggi non consegnati per ${event.props.name}: ${smsNotDelivered.length}`);

        /* Sms sent */
        const smsSent: SMSSearchInfo[] = data.smsList.filter((sms) => sms.status === SMSStatusType.SENT);
        debug(`Messaggi inviati per ${event.props.name}: ${smsSent.length}`);

        /* Sms to send again */
        const smsToCheckIfToSendAgain: SMSSearchInfo[] = [...smsSent, ...smsNotDelivered];
        const smsToSendAgain: SMSSearchInfo[] = smsToCheckIfToSendAgain.filter(
          (sms) => !smsDelivered.map((sms) => sms.to).includes(sms.to)
        );
        const smsPhone = smsToSendAgain.map((sms) => sms.to);
        const smsPhoneUnique = [...new Set(smsPhone)].map((phone) => phone.substring(2));
        debug(`Messaggi da rinviare di nuovo per ${event.props.name}: ${smsPhoneUnique.length}`);

        /* There must be at least one phone number to send the message for firebase query */
        if (smsPhoneUnique.length === 0) return;

        /* Get participations */
        const participationsToResendSMS: Participation[] = [];
        const participationDocuments: QuerySnapshot<DocumentData> = await admin
          .firestore()
          .collection('PROD_participations')
          .where('eventUid', '==', event.uid)
          .where('phone', 'in', smsPhoneUnique)
          .where('isActive', '==', true)
          .where('isScanned', '==', false)
          .where('messageAttempt', '<', 4)
          .get();
        participationDocuments.forEach((participation) => {
          const participationDTO = participation.data() as ParticipationDTO;

          if (!participationDTO.createdAt || participationDTO.createdAt.getTime() > oneHourAndHalfAgo.getTime()) return;
          participationsToResendSMS.push({ uid: participation.id, props: participationDTO });
        });
        debug(`Numeri da reinviare sms: ${participationsToResendSMS.map((p) => p.props.phone)}`);

        participationsToResendSMS.forEach(async (participation) => {
          debug(participation);
          const { name, phone, eventUid, tableUid } = participation.props;
          await sendSMS(participation.uid, name, phone, eventUid, event.props.message, tableUid);
        });
      });
    } catch (error) {
      logger.error(error);
    }
  });

/* -------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------- GENERAL --------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------- */
const sendSMS = async (
  participationUid: string,
  clientName: string,
  clientPhone: string,
  eventUid: string,
  eventMessage: string,
  tableUid: string
): Promise<void> => {
  try {
    /*  Fidelity  */
    const FIDELITY_MESSAGE =
      'Ciao {{CLIENT}}\nGrazie per aver completato la tua fidelity card, ecco il tuo ticket per Lunedì 24 Aprile.\n\n{{LINK}}';

    /*  Shorter url  */
    const urlToReduce = `https://enjoy-network-tavoli.web.app/ticket?participation=${participationUid}`;
    const request_urlShortener = `https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(urlToReduce)}`;
    const response_urlShortener = await axios.get(request_urlShortener);
    const link = (response_urlShortener.data as ShorterUrlResponse).result.full_short_link;

    /*  Send sms  */
    /* Replace params */
    const fidelityTables = process.env.FIDELITY_TABLES_UIDS?.split(',') || [];
    const messageToSend = fidelityTables.includes(tableUid) ? FIDELITY_MESSAGE : eventMessage;
    let messageClone = messageToSend.replace('{{CLIENT}}', clientName);
    messageClone = messageClone.replace('{{LINK}}', link);

    /* Headers */
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const credentials = btoa(`${username}:${password}`);
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`
    };

    /* Create sms */
    const request_urlSmsHosting = 'https://api.smshosting.it/rest/api/sms/send';
    const sms: SMS = {
      from: 'Enjoy N.',
      to: `39${clientPhone}`,
      transactionId: eventUid,
      text: messageClone,
      statusCallback: 'https://receivesmsv2-j7jdl53eta-uc.a.run.app',
      sandbox: false
    };

    /* Send sms */
    const response = await axios.post(request_urlSmsHosting, sms, { headers });

    /* Update participation about sms status */
    const smsResponse = response.data as SMSResponse;
    const document: DocumentReference<DocumentData> = admin.firestore().doc(`PROD_participations/${participationUid}`);
    const participationDTO = (await document.get()).data() as ParticipationDTO;
    document.update({
      messageAttempt: (participationDTO.messageAttempt || 0) + 1,
      modifiedAt: new Date()
    });
    if (smsResponse.smsNotInserted > 0) {
      document.update({
        statusSMS: smsResponse.sms[0].statusDetail,
        modifiedAt: new Date()
      });
    }
  } catch (error) {
    logger.error(error);
  }
};
