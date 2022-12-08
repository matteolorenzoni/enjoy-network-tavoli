import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { RoleType, ToastType } from './enum';

export type UserBaseInfo = {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  uid: string;
};

export type Toast = {
  type: ToastType | null;
  message: string | null;
  isVisible: boolean;
};

export type IconLink = {
  link: string;
  name: string;
  definition: IconDefinition;
};

export type BottomNavigation = {
  role: RoleType;
  name: string;
  icons: IconLink[];
};

export type EventDTO = {
  imageUrl: string;
  name: string;
  date: Date;
  timeStart: Date;
  timeEnd: Date;
  maxPerson: number;
  place: string;
  guest: string;
  description: string;
  messageText: string;
  createdAt: Date;
  modificatedAt: Date;
};

export type Event = {
  uid: string;
  eventDTO: EventDTO;
};

export type FirebaseDate = {
  seconds: number;
  nanoseconds: number;
};
