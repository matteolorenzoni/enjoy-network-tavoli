import { RoleType } from './enum';

export enum Table {
  EMPLOYEES = 'employees',
  EVENTS = 'events'
}

export type EmployeeDTO = {
  name: string;
  lastName: string;
  role: RoleType;
  phone: string;
  zone: string;
  active: boolean;
  createdAt: Date;
  modificatedAt: Date;
};
