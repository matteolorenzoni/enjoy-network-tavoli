import { RoleTypeEnum } from './enum';

export enum Table {
  EMPLOYEE = 'employees'
}

export type Employee = {
  name: string;
  lastName: string;
  role: RoleTypeEnum;
  active: boolean;
};
