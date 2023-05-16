export enum ButtonType {
  BUTTON = 'button',
  SUBMIT = 'submit',
  RESET = 'reset'
}
export enum InputType {
  BUTTON = 'button',
  CHECKBOX = 'checkbox',
  COLOR = 'color',
  DATE = 'date',
  DATETIME = 'datetime-local',
  EMAIL = 'email',
  FILE = 'file',
  HIDDEN = 'hidden',
  IMAGE = 'image',
  MONTH = 'month',
  NUMBER = 'number',
  PASSWORD = 'password',
  RADIO = 'radio',
  RANGE = 'range',
  RESET = 'reset',
  SEARCH = 'search',
  SUBMIT = 'submit',
  TEL = 'tel',
  TEXT = 'text',
  TIME = 'time',
  URL = 'url',
  WEEK = 'week'
}

export enum PaletteType {
  PRIMARY = 'primary',
  PRIMARY_INVERSE = 'primary-inverse',
  SECONDARY = 'secondary',
  SECONDARY_INVERSE = 'secondary-inverse'
}

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export enum FirebaseErrorCode {
  USER_DISABLED = 'auth/user-disabled',
  USER_NOT_FOUND = 'auth/user-not-found',
  WRONG_PASSWORD = 'auth/wrong-password',
  TOO_MANY_ATTEMPTS_TRY_LATER = 'auth/too-many-requests',
  INVALID_PASSWORD = 'auth/invalid-password',
  EMAIL_NOT_FOUND = 'auth/email-not-found',

  EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
  INVALID_EMAIL = 'auth/invalid-email',
  OPERATION_NOT_ALLOWED = 'auth/operation-not-allowed',
  WEAK_PASSWORD = 'auth/weak-password'
}

export enum RoleType {
  ADMINISTRATOR = 'administrator',
  INSPECTOR = 'inspector',
  PR = 'pr'
}

export enum PlaceType {
  BACCARA = 'Baccara',
  INDIE = 'Indie',
  CUPOLE = 'Cupole',
  DIVINO = 'Divino',
  ACQUE_MINERALI = 'Acque Minerali',
  PELLARIA = 'Pellaria',
  MARINA_BAY = 'Marina Bay',
  IMOLA = 'Imola',
  LUGO = 'Lugo'
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
  NOSENT = 'NOSENT',
  DELIVERED = 'DELIVERED',
  NOTDELIVERED = 'NOTDELIVERED'
}
