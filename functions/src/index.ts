import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { DocumentData, DocumentReference, DocumentSnapshot } from 'firebase-admin/firestore';
import { ParticipationDTO, EventDTO, TableDTO, AssignmentDTO, ClientDTO } from './collection';
import { ShorterUrlResponse, SMS, SMSResponse } from './type';
import { SMSStatusType } from './enum';

admin.initializeApp();

/* -------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------- TEST --------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------- */
export const testParticipatiOnCreate = functions.firestore
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
      console.error(JSON.stringify(error));
    }
  });

export const testParticipatiOnUpdate = functions.firestore
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
      console.error(JSON.stringify(error));
    }
  });

export const testAssignmentOnUpdate = functions.firestore.document('assignments/{assignmentId}').onUpdate((change) => {
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
          maxPersonMarkable: personMarked,
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
    console.error(JSON.stringify(error));
    return null;
  }
});

export const testClientOnUpdate = functions.firestore.document('clients/{clientId}').onUpdate(async (change) => {
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
    console.error(JSON.stringify(error));
  }
});

export const testClientOnDelete = functions.firestore.document('clients/{clientId}').onDelete(async (snapshot) => {
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
    console.error(JSON.stringify(error));
  }
});

export const testVisibilityChange = functions.https.onRequest(async (request, response) => {
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
  //   console.log(error);
  //   console.log(JSON.stringify(error));
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
    console.log(error);
    console.log(JSON.stringify(error));
    response.send('Error');
  }
});

/* -------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------- PRO --------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------- */
export const sendSms = functions.firestore
  .document('PROD_participations/{participationId}')
  .onCreate(async (snap, context) => {
    const participationUid = context.params.participationId;
    const participationDTO = snap.data() as ParticipationDTO;
    const { eventUid, tableUid, name, phone } = participationDTO;

    try {
      /* -------------------------------------------------------- Get event -------------------------------------------------------- */
      const document: DocumentData = await admin.firestore().doc(`PROD_events/${eventUid}`).get();
      const eventDTO = document.data() as EventDTO;
      const { message } = eventDTO;

      /* --------------------------------------------------- Fidelity --------------------------------------------------- */
      const FIDELITY_MESSAGE =
        'Ciao {{CLIENT}}\nGrazie per aver completato la tua fidelity card, ecco il tuo ticket per Lunedì 24 Aprile.\n\n{{LINK}}';

      /* -------------------------------------------------------- Shorter url -------------------------------------------------------- */
      const urlToReduce = `https://enjoy-network-tavoli.web.app/ticket?participation=${participationUid}`;
      const request_urlShortener = `https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(urlToReduce)}`;
      const response_urlShortener = await axios.get(request_urlShortener);
      const link = (response_urlShortener.data as ShorterUrlResponse).result.full_short_link;

      /* -------------------------------------------------------- Send sms -------------------------------------------------------- */
      /* Replace params */
      const fidelityTables = process.env.FIDELITY_TABLES_UIDS?.split(',') || [];
      const messageToSend = fidelityTables.includes(tableUid) ? FIDELITY_MESSAGE : message;
      let messageClone = messageToSend.replace('{{CLIENT}}', name);
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
        to: `39${phone}`,
        transactionId: eventUid,
        text: messageClone,
        statusCallback: 'https://us-central1-enjoy-network-tavoli.cloudfunctions.net/receiveSms',
        sandbox: false
      };

      const response = await axios.post(request_urlSmsHosting, sms, { headers });
      const smsResponse = response.data as SMSResponse;

      if (smsResponse.smsNotInserted > 0) {
        snap.ref.update({
          statusSMS: smsResponse.sms[0].statusDetail,
          modifiedAt: new Date()
        });
      }
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  });

export const receiveSms = functions.https.onRequest(async (request, response) => {
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
    console.log(error);
    console.log(JSON.stringify(error));
    response.send('Error');
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
      console.error(JSON.stringify(error));
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
      console.error(JSON.stringify(error));
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
          maxPersonMarkable: personMarked,
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
    console.error(JSON.stringify(error));
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
    console.error(JSON.stringify(error));
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
  //   console.log(error);
  //   console.log(JSON.stringify(error));
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
    console.log(error);
    console.log(JSON.stringify(error));
    response.send('Error');
  }
});
