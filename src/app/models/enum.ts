export enum ButtonTypeEnum {
  BUTTON = 'button',
  SUBMIT = 'submit',
  RESET = 'reset'
}
export enum InputTypeEnum {
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

export enum PaletteTypeEnum {
  PRIMARY = 'primary',
  PRIMARY_INVERSE = 'primary-inverse',
  SECONDARY = 'secondary',
  SECONDARY_INVERSE = 'secondary-inverse'
}

export enum ToastTypeEnum {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}
// enumeration of firebase errors with signInWithEmailAndPassworf
export enum FirebaseLoginErrorEnum {
  INVALID_EMAIL = 'Firebase: Error (auth/invalid-email).',
  USER_DISABLED = 'Firebase: Error (auth/user-disabled).',
  USER_NOT_FOUND = 'Firebase: Error (auth/user-not-found).',
  WRONG_PASSWORD = 'Firebase: Error (auth/wrong-password).',
  TOO_MANY_ATTEMPTS_TRY_LATER = 'Firebase: Error (auth/too-many-requests).',
  OPERATION_NOT_ALLOWED = 'Firebase: Error (auth/operation-not-allowed).',
  INVALID_PASSWORD = 'Firebase: Error (auth/invalid-password).',
  EMAIL_NOT_FOUND = 'Firebase: Error (auth/email-not-found).'
}

export enum RoleTypeEnum {
  ADMINISTRATOR = 'administrator',
  INSPECTOR = 'inspector',
  PR = 'pr'
}
