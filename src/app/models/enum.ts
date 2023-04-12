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

export enum FirebaseLoginErrorType {
  INVALID_EMAIL = 'Firebase: Error (auth/invalid-email).',
  USER_DISABLED = 'Firebase: Error (auth/user-disabled).',
  USER_NOT_FOUND = 'Firebase: Error (auth/user-not-found).',
  WRONG_PASSWORD = 'Firebase: Error (auth/wrong-password).',
  TOO_MANY_ATTEMPTS_TRY_LATER = 'Firebase: Error (auth/too-many-requests).',
  OPERATION_NOT_ALLOWED = 'Firebase: Error (auth/operation-not-allowed).',
  INVALID_PASSWORD = 'Firebase: Error (auth/invalid-password).',
  EMAIL_NOT_FOUND = 'Firebase: Error (auth/email-not-found).'
}

export enum RoleType {
  ADMINISTRATOR = 'administrator',
  INSPECTOR = 'inspector',
  PR = 'pr'
}

export enum PlaceType {
  BACCARA = 'Baccara',
  INDIE = 'Indie',
  CUPOLE = 'Cupole'
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
