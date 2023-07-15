import { ParticipationDTO } from './collection';
import { SMSStatusType } from './enum';

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

export type SMSSearchInfo = {
  id: number;
  status: SMSStatusType;
  sentDate: Date | string;
  price: number;
  from: string;
  insertDate: Date | string;
  deliveryDate: Date | string;
  text: string;
  to: string;
  transactionId: string;
};

export type SMSSend = {
  metadata: {
    count: number;
    offset: number;
    limit: number;
  };
  smsList: SMSSearchInfo[];
};

export type Participation = {
  readonly uid: string;
  props: ParticipationDTO;
};
