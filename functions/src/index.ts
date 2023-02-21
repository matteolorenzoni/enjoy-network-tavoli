import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { DocumentData } from 'firebase-admin/firestore';

admin.initializeApp();

type ShorterUrlResponse = {
  ok: boolean;
  result: {
    full_short_link: string;
  };
};

type SMS = {
  to: string;
  text: string;
  sandbox: boolean;
};

type SMSResponse = {
  from: string;
  text: string;
  transactionId: string;
  smsInserted: number;
  smsNotInserted: number;
  sms: SMSInfo[];
};

type SMSInfo = {
  id: number;
  to: string;
  status: 'INSERTED' | 'NOT_INSERTED';
  statusDetail?: 'BADNUMBERFORMAT' | 'DUPLICATESMS' | 'BLACKLIST';
};

type EventDTO = {
  imageUrl: string;
  code: string;
  name: string;
  date: Date;
  timeStart: Date;
  timeEnd: Date;
  maxPerson: number;
  place: string;
  guest?: string;
  description?: string;
  message: string;
  createdAt?: Date;
  modifiedAt?: Date;
};

type ParticipationDTO = {
  eventUid: string;
  tableUid: string;
  name: string;
  lastName: string;
  phone: string;
  isScanned: boolean;
  messageIsReceived: boolean;
  errorIfMessageIsNotReceived?: 'BADNUMBERFORMAT' | 'DUPLICATESMS' | 'BLACKLIST';
  isActive: boolean;
  createdAt?: Date;
  modifiedAt?: Date;
};

export const sendSms = functions.firestore
  .document('PROD_participations/{participationId}')
  .onCreate(async (snap, context) => {
    const participationUid = context.params.participationId;
    const participationDTO = snap.data() as ParticipationDTO;
    const { eventUid, name, phone } = participationDTO;

    try {
      /* -------------------------------------------------------- Get event -------------------------------------------------------- */
      const document: DocumentData = await admin.firestore().doc(`PROD_events/${eventUid}`).get();
      const eventDTO = document.data() as EventDTO;
      const { message } = eventDTO;

      /* -------------------------------------------------------- Shorter url -------------------------------------------------------- */
      const urlToReduce = `https://enjoy-network-tavoli.web.app/ticket?participation=${participationUid}`;
      const request_urlShortener = `https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(urlToReduce)}`;
      const response_urlShortener = await axios.get(request_urlShortener);
      const link = (response_urlShortener.data as ShorterUrlResponse).result.full_short_link;

      /* -------------------------------------------------------- Send sms -------------------------------------------------------- */
      /* Replace params */
      let messageClone = message.replace('{{CLIENT}}', name);
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
        to: `39${phone}`,
        text: messageClone,
        sandbox: true
      };

      const response = await axios.post(request_urlSmsHosting, sms, { headers });
      const smsResponse = response.data as SMSResponse;
      console.log(JSON.stringify(smsResponse));

      if (smsResponse.smsNotInserted > 0) {
        snap.ref.update({
          errorIfMessageIsNotReceived: smsResponse.sms[0].statusDetail,
          modifiedAt: new Date()
        });
      } else {
        snap.ref.update({
          messageIsReceived: true,
          modifiedAt: new Date()
        });
      }
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  });
