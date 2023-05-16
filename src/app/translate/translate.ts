import { FirebaseErrorCode } from '../models/enum';

export const translateFirebaseErrorMessage = (errorMessage: FirebaseErrorCode) => {
  switch (errorMessage) {
    case FirebaseErrorCode.USER_DISABLED:
      return 'Utente disabilitato';
    case FirebaseErrorCode.USER_NOT_FOUND:
      return 'Utente non trovato';
    case FirebaseErrorCode.WRONG_PASSWORD:
      return 'Password errata';
    case FirebaseErrorCode.TOO_MANY_ATTEMPTS_TRY_LATER:
      return 'Troppi tentativi, riprova più tardi';
    case FirebaseErrorCode.INVALID_PASSWORD:
      return 'Password non valida';
    case FirebaseErrorCode.EMAIL_NOT_FOUND:
      return 'Email non trovata';

    case FirebaseErrorCode.EMAIL_ALREADY_IN_USE:
      return 'Email già in uso';
    case FirebaseErrorCode.INVALID_EMAIL:
      return 'Email non valida';
    case FirebaseErrorCode.OPERATION_NOT_ALLOWED:
      return 'Operazione non consentita, contattare uno staffer';
    case FirebaseErrorCode.WEAK_PASSWORD:
      return 'Password debole';
    default:
      return 'Errore sconosciuto';
  }
};
