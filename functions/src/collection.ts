import { ParticipationType, RoleType, SMSErrorType } from './enum';

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
  lastName?: string;
  email: string;
  role: RoleType;
  phone?: string;
  zone?: string;
  isActive: boolean;
  createdAt?: Date;
  modifiedAt?: Date;
};

export type AssignmentDTO = {
  eventUid: string;
  employeeUid: string;
  personMarked: number;
  maxPersonMarkable: number;
  isActive: boolean;
  createdAt?: Date;
  modifiedAt?: Date;
};

export type TableDTO = {
  eventUid: string;
  employeeUid: string;
  name: string;
  price?: number;
  hour?: Date;
  drinkList?: string;
  personsTotal: number;
  personsActive: number;
  personsScanned: number;
  isActive: boolean;
  createdAt?: Date;
  modifiedAt?: Date;
};

export type ParticipationDTO = {
  eventUid: string;
  type: ParticipationType;
  tableUid: string;
  name: string;
  lastName: string;
  phone: string;
  isScanned: boolean;
  scannedAt?: Date;
  scannedFrom?: string;
  messageIsReceived: boolean;
  errorIfMessageIsNotReceived?: SMSErrorType;
  isActive: boolean;
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

export type CustomErrorDTO = {
  message: string;
  trace: string;
  from: string;
  createdAt?: Date;
  modifiedAt?: Date;
};
