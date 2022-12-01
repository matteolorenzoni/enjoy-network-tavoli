import { ToastTypeEnum } from './enum';

export type UserBaseInfo = {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  uid: string;
};

export type Toast = {
  type: ToastTypeEnum | null;
  message: string | null;
  isVisible: boolean;
};
