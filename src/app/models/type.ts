import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { RoleType, ToastType } from './enum';
import { AssignmentDTO, EmployeeDTO, EventDTO } from './table';

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

export type Assignment = {
  readonly uid: string;
  assignmentDTO: AssignmentDTO;
};

export type AssignmentAndEmployee = Assignment & Pick<EmployeeDTO, 'name' | 'lastName' | 'zone'>;
