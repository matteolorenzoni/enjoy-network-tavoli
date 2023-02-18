import * as functions from 'firebase-functions';
import axios from 'axios';

export const aaaa = functions.firestore.document('PROD_participations/{participationId}').onCreate((snap, context) => {
  // const participation = snap.data() as ParticipationDTO;

  const url = 'https://api.smshosting.it/rest/api/sms/send';

  var sms = {
    to: '393480000000',
    text: 'sms di test',
    sandbox: 'true'
  };

  /* Headers */
  const username = 'SMSHTRO41JB2NB5RV2ZNF';
  const password = 'WR3NSN1BWOTVD66QRAQTWFZ3E6QHK4U5';
  const credentials = btoa(`${username}:${password}`);
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${credentials}`
  };

  axios
    .post(url, sms, { headers })
    .then((response: any) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error: any) => {
      console.log(error);
    });
});

export const sanitizeOnUpdate = functions.firestore.document('{collection}/{id}').onUpdate((change, context) => {
  const beforeData = change.before.data();
  const afterData = change.after.data();

  const keys = Object.keys(afterData);
  const nullKeys = keys.filter((key) => afterData[key] === null || afterData[key] === '');
  nullKeys.forEach((key) => delete afterData[key]);

  afterData['createdAt'] = beforeData['createdAt'];
  afterData['modifiedAt'] = new Date();

  return change.after.ref.update(afterData);
});
