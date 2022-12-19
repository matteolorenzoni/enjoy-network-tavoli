import { EmployeeDTO, EventDTO } from 'src/app/models/table';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue
} from '@angular/fire/firestore';
import { Employee, Event } from './type';

export const employeeConverter: FirestoreDataConverter<Employee> = {
  toFirestore(employee: Employee): WithFieldValue<DocumentData> {
    const { employeeDTO } = employee;
    const data: EmployeeDTO = {
      name: employeeDTO.name,
      lastName: employeeDTO.lastName,
      role: employeeDTO.role,
      phone: employeeDTO.phone,
      zone: employeeDTO.zone,
      active: employeeDTO.active,
      createdAt: employeeDTO.createdAt ? employeeDTO.createdAt : new Date(),
      modificatedAt: new Date()
    };
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Employee {
    const data: EmployeeDTO = snapshot.data(options) as EmployeeDTO;
    const employee: Employee = {
      uid: snapshot.id,
      employeeDTO: {
        name: data.name,
        lastName: data.lastName,
        role: data.role,
        phone: data.phone,
        zone: data.zone,
        active: data.active,
        createdAt: new Date((data.createdAt as unknown as number) * 1000),
        modificatedAt: new Date((data.modificatedAt as unknown as number) * 1000)
      }
    };
    return employee;
  }
};

export const eventConverter: FirestoreDataConverter<Event> = {
  toFirestore(event: Event): WithFieldValue<DocumentData> {
    const { eventDTO } = event;
    const data: EventDTO = {
      imageUrl: eventDTO.imageUrl,
      name: eventDTO.name,
      date: eventDTO.date,
      timeStart: eventDTO.timeStart,
      timeEnd: eventDTO.timeEnd,
      maxPerson: eventDTO.maxPerson,
      place: eventDTO.place,
      guest: eventDTO.guest,
      description: eventDTO.description,
      messageText: eventDTO.messageText,
      createdAt: eventDTO.createdAt ? eventDTO.createdAt : new Date(),
      modificatedAt: new Date()
    };
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Event {
    const data: EventDTO = snapshot.data(options) as EventDTO;
    const event: Event = {
      uid: snapshot.id,
      eventDTO: {
        imageUrl: data.imageUrl,
        name: data.name,
        date: new Date((data.date as unknown as number) * 1000),
        timeStart: data.timeStart,
        timeEnd: data.timeEnd,
        maxPerson: data.maxPerson,
        place: data.place,
        guest: data.guest,
        description: data.description,
        messageText: data.messageText,
        createdAt: new Date((data.createdAt as unknown as number) * 1000),
        modificatedAt: new Date((data.modificatedAt as unknown as number) * 1000)
      }
    };
    return event;
  }
};
