import { RoleType } from './enum';

export enum Table {
  EMPLOYEES = 'employees',
  EVENTS = 'events'
}

export type Employee = {
  name: string;
  lastName: string;
  role: RoleType;
  active: boolean;
  phone: string;
};
