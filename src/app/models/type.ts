import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { RoleType, ToastType } from './enum';
import { EmployeeDTO, EventDTO, EventEmployeeDTO } from './table';

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
  readonly uid: string;
  eventDTO: EventDTO;
};

export type Employee = {
  readonly uid: string;
  employeeDTO: EmployeeDTO;
};

export type EventEmployee = {
  readonly uid: string;
  eventEmployeeDTO: EventEmployeeDTO;
};

export type EvEm = EventEmployee & Pick<EmployeeDTO, 'name' | 'lastName' | 'zone'>;
