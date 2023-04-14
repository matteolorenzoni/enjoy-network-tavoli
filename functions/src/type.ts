import { ParticipationDTO } from './collection';

export type ShorterUrlResponse = {
  ok: boolean;
  result: {
    full_short_link: string;
  };
};

export type SMS = {
  from: string;
  to: string;
  text: string;
  transactionId: string;
  statusCallback: string;
  sandbox: boolean;
};

export type SMSResponse = {
  from: string;
  text: string;
  transactionId: string;
  smsInserted: number;
  smsNotInserted: number;
  sms: SMSInfo[];
};

export type SMSInfo = {
  id: number;
  to: string;
  status: 'INSERTED' | 'NOT_INSERTED';
  statusDetail?: 'BADNUMBERFORMAT' | 'DUPLICATESMS' | 'BLACKLIST';
};

export type Participation = {
  readonly uid: string;
  props: ParticipationDTO;
};
