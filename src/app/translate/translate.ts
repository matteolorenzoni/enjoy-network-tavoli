import { FirebaseLoginErrorEnum } from '../models/enum';

export const translateFirebaseErrorMessage = (errorMessage: FirebaseLoginErrorEnum) => {
  switch (errorMessage) {
    case FirebaseLoginErrorEnum.INVALID_EMAIL:
      return 'Email non valida';
    case FirebaseLoginErrorEnum.USER_DISABLED:
      return 'Utente disabilitato';
    case FirebaseLoginErrorEnum.USER_NOT_FOUND:
      return 'Utente non trovato';
    case FirebaseLoginErrorEnum.WRONG_PASSWORD:
      return 'Password errata';
    case FirebaseLoginErrorEnum.TOO_MANY_ATTEMPTS_TRY_LATER:
      return 'Troppi tentativi, riprova più tardi';
    case FirebaseLoginErrorEnum.OPERATION_NOT_ALLOWED:
      return 'Operazione non consentita';
    case FirebaseLoginErrorEnum.INVALID_PASSWORD:
      return 'Password non valida';
    case FirebaseLoginErrorEnum.EMAIL_NOT_FOUND:
      return 'Email non trovata';
    default:
      return 'Errore sconosciuto';
  }
};
