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
