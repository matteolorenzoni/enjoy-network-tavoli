import { RoleType } from './enum';

export enum Table {
  EMPLOYEES = 'employees',
  EVENTS = 'events'
}

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
