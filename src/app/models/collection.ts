import { RoleType } from './enum';

export enum Collection {
  EMPLOYEES = 'PROD_employees',
  EVENTS = 'PROD_events',
  ASSIGNMENTS = 'PROD_assignments',
  TABLES = 'PROD_tables',
  PARTICIPATIONS = 'PROD_participations',
  CLIENTS = 'PROD_clients'
}

export type EventDTO = {
  imageUrl: string;
  code: string;
  name: string;
  date: Date;
  timeStart: Date;
  timeEnd: Date;
  maxPerson: number;
  place: string;
  guest?: string;
  description?: string;
  message: string;
  createdAt?: Date;
  modifiedAt?: Date;
};

export type EmployeeDTO = {
  name: string;
  lastName: string | null;
  role: RoleType;
  phone: string | null;
  email: string;
  zone: string | null;
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
