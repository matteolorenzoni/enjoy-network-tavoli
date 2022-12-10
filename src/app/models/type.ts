import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { RoleType, ToastType } from './enum';
import { EmployeeDTO, EventDTO } from './table';

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

export type Event = {
  uid: string;
  eventDTO: EventDTO;
};

export type FirebaseDate = {
  seconds: number;
  nanoseconds: number;
};

export type Employee = {
  uid: string;
  employeeDTO: EmployeeDTO;
};
