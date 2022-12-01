import { RoleType } from './enum';

export enum Table {
  EMPLOYEE = 'employees'
}

export type Employee = {
  name: string;
  lastName: string;
  role: RoleType;
  active: boolean;
};
