import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { RoleType, ToastType } from './enum';
import {
  AssignmentDTO,
  ClientDTO,
  CustomErrorDTO,
  EmployeeDTO,
  EventDTO,
  ParticipationDTO,
  TableDTO
} from './collection';

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
  icons: IconLink[];
};

export type Event = {
  readonly uid: string;
  props: EventDTO;
};

export type Employee = {
  readonly uid: string;
  props: EmployeeDTO;
};

export type Assignment = {
  readonly uid: string;
  props: AssignmentDTO;
};

export type Table = {
  readonly uid: string;
  props: TableDTO;
};

export type Participation = {
  readonly uid: string;
  props: ParticipationDTO;
};

export type Client = {
  readonly uid: string;
  props: ClientDTO;
};

export type CustomError = {
  readonly uid: string;
  props: CustomErrorDTO;
};

export type EmployeeAssignment = {
  employee: Employee;
  assignment?: Assignment;
};
