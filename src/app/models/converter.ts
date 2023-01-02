import { AssignmentDTO, ClientDTO, EmployeeDTO, EventDTO, TableDTO } from 'src/app/models/collection';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  WithFieldValue
} from '@angular/fire/firestore';
import { Assignment, Client, Employee, Event, Table } from './type';

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
        createdAt: new Date((data.createdAt as unknown as Timestamp).seconds * 1000),
        modificatedAt: new Date((data.modificatedAt as unknown as Timestamp).seconds * 1000)
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
      modificatedAt: eventDTO.modificatedAt ? eventDTO.modificatedAt : new Date()
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
        date: new Date((data.date as unknown as Timestamp).seconds * 1000),
        timeStart: data.timeStart,
        timeEnd: data.timeEnd,
        maxPerson: data.maxPerson,
        place: data.place,
        guest: data.guest,
        description: data.description,
        messageText: data.messageText,
        createdAt: new Date((data.createdAt as unknown as Timestamp).seconds * 1000),
        modificatedAt: new Date((data.modificatedAt as unknown as Timestamp).seconds * 1000)
      }
    };
    return event;
  }
};

export const assignmentConverter: FirestoreDataConverter<Assignment> = {
  toFirestore(assignment: Assignment): WithFieldValue<DocumentData> {
    const { assignmentDTO } = assignment;
    const data: AssignmentDTO = {
      eventUid: assignmentDTO.eventUid,
      employeeUid: assignmentDTO.employeeUid,
      active: assignmentDTO.active,
      personMarked: assignmentDTO.personMarked,
      personAssigned: assignmentDTO.personAssigned,
      createdAt: assignmentDTO.createdAt ? assignmentDTO.createdAt : new Date(),
      modificatedAt: assignmentDTO.modificatedAt ? assignmentDTO.modificatedAt : new Date()
    };
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Assignment {
    const data: AssignmentDTO = snapshot.data(options) as AssignmentDTO;
    const assignment: Assignment = {
      uid: snapshot.id,
      assignmentDTO: {
        eventUid: data.eventUid,
        employeeUid: data.employeeUid,
        active: data.active,
        personMarked: data.personMarked,
        personAssigned: data.personAssigned,
        createdAt: new Date((data.createdAt as unknown as Timestamp).seconds * 1000),
        modificatedAt: new Date((data.modificatedAt as unknown as Timestamp).seconds * 1000)
      }
    };
    return assignment;
  }
};

export const tableConverter: FirestoreDataConverter<Table> = {
  toFirestore(table: Table): WithFieldValue<DocumentData> {
    const { tableDTO } = table;
    const data: TableDTO = {
      eventUid: tableDTO.eventUid,
      employeeUid: tableDTO.employeeUid,
      name: tableDTO.name,
      price: tableDTO.price,
      hour: tableDTO.hour,
      drink: tableDTO.drink,
      personMarked: tableDTO.personMarked ? tableDTO.personMarked : 0,
      personAssigned: tableDTO.personAssigned ? tableDTO.personAssigned : 0,
      createdAt: tableDTO.createdAt ? tableDTO.createdAt : new Date(),
      modificatedAt: tableDTO.modificatedAt ? tableDTO.modificatedAt : new Date()
    };
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Table {
    const data: TableDTO = snapshot.data(options) as TableDTO;
    const table: Table = {
      uid: snapshot.id,
      tableDTO: {
        eventUid: data.eventUid,
        employeeUid: data.employeeUid,
        name: data.name,
        price: data.price,
        hour: new Date((data.hour as unknown as Timestamp).seconds * 1000),
        drink: data.drink,
        personMarked: data.personMarked,
        personAssigned: data.personAssigned,
        createdAt: new Date((data.createdAt as unknown as Timestamp).seconds * 1000),
        modificatedAt: new Date((data.modificatedAt as unknown as Timestamp).seconds * 1000)
      }
    };
    return table;
  }
};

export const clientConverter: FirestoreDataConverter<Client> = {
  toFirestore(client: Client): WithFieldValue<DocumentData> {
    const { clientDTO } = client;
    const data: ClientDTO = {
      name: clientDTO.name,
      lastName: clientDTO.lastName,
      phone: clientDTO.phone,
      createdAt: clientDTO.createdAt ? clientDTO.createdAt : new Date(),
      modificatedAt: clientDTO.modificatedAt ? clientDTO.modificatedAt : new Date()
    };
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Client {
    const data: ClientDTO = snapshot.data(options) as ClientDTO;
    const client: Client = {
      uid: snapshot.id,
      clientDTO: {
        name: data.name,
        lastName: data.lastName,
        phone: data.phone,
        createdAt: new Date((data.createdAt as unknown as Timestamp).seconds * 1000),
        modificatedAt: new Date((data.modificatedAt as unknown as Timestamp).seconds * 1000)
      }
    };
    return client;
  }
};
