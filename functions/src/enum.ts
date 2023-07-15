export enum RoleType {
  ADMINISTRATOR = 'administrator',
  INSPECTOR = 'inspector',
  PR = 'pr'
}

export enum ParticipationType {
  TABLE = 'Table',
  FIDELITY = 'Fidelity'
}

export enum SMSErrorType {
  BADNUMBERFORMAT = 'BADNUMBERFORMAT',
  DUPLICATESMS = 'DUPLICATESMS',
  BLACKLIST = 'BLACKLIST'
}

export enum SMSStatusType {
  PENDING = 'PENDING',
  SENT = 'SENT',
  NO_SENT = 'NOSENT',
  DELIVERED = 'DELIVERED',
  NOT_DELIVERED = 'NOTDELIVERED'
}
