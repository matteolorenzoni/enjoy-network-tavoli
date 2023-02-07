import { RoleType } from './enum';

export enum Collection {
  EMPLOYEES = 'employees',
  EVENTS = 'events',
  ASSIGNMENTS = 'assignments',
  TABLES = 'tables',
  PARTICIPATIONS = 'participations',
  CLIENTS = 'clients'
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
  message: string;
  createdAt?: Date;
  modifiedAt?: Date;
};

export type EmployeeDTO = {
  name: string;
  lastName: string;
  role: RoleType;
  phone: string;
  email: string;
  zone: string;
  isActive: boolean;
  createdAt?: Date;
  modifiedAt?: Date;
};

export type AssignmentDTO = {
  eventUid: string;
  employeeUid: string;
  isActive: boolean;
  personMarked: number;
  maxPersonMarkable: number;
  createdAt?: Date;
  modifiedAt?: Date;
};

export type TableDTO = {
  eventUid: string;
  employeeUid: string;
  name: string;
  price: number;
  hour: Date;
  drink: string;
  createdAt?: Date;
  modifiedAt?: Date;
};

export type ParticipationDTO = {
  eventUid: string;
  tableUid: string;
  clientUid: string;
  isActive: boolean;
  isScanned: boolean;
  messageIsReceived: boolean;
  createdAt?: Date;
  modifiedAt?: Date;
};

export type ClientDTO = {
  name: string;
  lastName: string;
  phone: string;
  createdAt?: Date;
  modifiedAt?: Date;
};
