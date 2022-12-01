import { FirebaseLoginErrorType } from '../models/enum';

export const translateFirebaseErrorMessage = (errorMessage: FirebaseLoginErrorType) => {
  switch (errorMessage) {
    case FirebaseLoginErrorType.INVALID_EMAIL:
      return 'Email non valida';
    case FirebaseLoginErrorType.USER_DISABLED:
      return 'Utente disabilitato';
    case FirebaseLoginErrorType.USER_NOT_FOUND:
      return 'Utente non trovato';
    case FirebaseLoginErrorType.WRONG_PASSWORD:
      return 'Password errata';
    case FirebaseLoginErrorType.TOO_MANY_ATTEMPTS_TRY_LATER:
      return 'Troppi tentativi, riprova più tardi';
    case FirebaseLoginErrorType.OPERATION_NOT_ALLOWED:
      return 'Operazione non consentita';
    case FirebaseLoginErrorType.INVALID_PASSWORD:
      return 'Password non valida';
    case FirebaseLoginErrorType.EMAIL_NOT_FOUND:
      return 'Email non trovata';
    default:
      return 'Errore sconosciuto';
  }
};
