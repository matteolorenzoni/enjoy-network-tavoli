import { RoleType } from './enum';

export enum Collection {
  EMPLOYEES = 'employees',
  EVENTS = 'events',
  ASSIGNMENTS = 'assignments',
  TABLES = 'tables'
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
  createdAt?: Date;
  modificatedAt?: Date;
};

export type EmployeeDTO = {
  name: string;
  lastName: string;
  role: RoleType;
  phone: string;
  zone: string;
  active: boolean;
  createdAt?: Date;
  modificatedAt?: Date;
};

export type AssignmentDTO = {
  eventUid: string;
  employeeUid: string;
  active: boolean;
  personMarked: number;
  personAssigned: number;
  createdAt?: Date;
  modificatedAt?: Date;
};

export type TableDTO = {
  eventUid: string;
  employeeUid: string;
  name: string;
  price: number;
  hour: Date;
  drink: string;
  createdAt?: Date;
  modificatedAt?: Date;
};
