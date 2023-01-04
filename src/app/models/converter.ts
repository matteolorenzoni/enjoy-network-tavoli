import { AssignmentDTO, ClientDTO, EmployeeDTO, EventDTO, ParticipationDTO, TableDTO } from 'src/app/models/collection';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  WithFieldValue
} from '@angular/fire/firestore';
import { Assignment, Client, Employee, Event, Participation, Table } from './type';

export const employeeConverter: FirestoreDataConverter<Employee> = {
  toFirestore(employee: Employee): WithFieldValue<DocumentData> {
    const { props } = employee;
    const data: EmployeeDTO = {
      name: props.name,
      lastName: props.lastName,
      role: props.role,
      phone: props.phone,
      zone: props.zone,
      active: props.active,
      createdAt: props.createdAt ? props.createdAt : new Date(),
      modificatedAt: new Date()
    };
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Employee {
    const data: EmployeeDTO = snapshot.data(options) as EmployeeDTO;
    const employee: Employee = {
      uid: snapshot.id,
      props: {
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
    const { props } = event;
    const data: EventDTO = {
      imageUrl: props.imageUrl,
      name: props.name,
      date: props.date,
      timeStart: props.timeStart,
      timeEnd: props.timeEnd,
      maxPerson: props.maxPerson,
      place: props.place,
      guest: props.guest,
      description: props.description,
      messageText: props.messageText,
      createdAt: props.createdAt ? props.createdAt : new Date(),
      modificatedAt: props.modificatedAt ? props.modificatedAt : new Date()
    };
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Event {
    const data: EventDTO = snapshot.data(options) as EventDTO;
    const event: Event = {
      uid: snapshot.id,
      props: {
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
    const { props } = assignment;
    const data: AssignmentDTO = {
      eventUid: props.eventUid,
      employeeUid: props.employeeUid,
      active: props.active,
      personMarked: props.personMarked,
      personAssigned: props.personAssigned,
      createdAt: props.createdAt ? props.createdAt : new Date(),
      modificatedAt: props.modificatedAt ? props.modificatedAt : new Date()
    };
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Assignment {
    const data: AssignmentDTO = snapshot.data(options) as AssignmentDTO;
    const assignment: Assignment = {
      uid: snapshot.id,
      props: {
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
    const { props } = table;
    const data: TableDTO = {
      eventUid: props.eventUid,
      employeeUid: props.employeeUid,
      name: props.name,
      price: props.price,
      hour: props.hour,
      drink: props.drink,
      personMarked: props.personMarked ? props.personMarked : 0,
      personAssigned: props.personAssigned ? props.personAssigned : 0,
      createdAt: props.createdAt ? props.createdAt : new Date(),
      modificatedAt: props.modificatedAt ? props.modificatedAt : new Date()
    };
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Table {
    const data: TableDTO = snapshot.data(options) as TableDTO;
    const table: Table = {
      uid: snapshot.id,
      props: {
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
    const { props } = client;
    const data: ClientDTO = {
      name: props.name,
      lastName: props.lastName,
      phone: props.phone,
      createdAt: props.createdAt ? props.createdAt : new Date(),
      modificatedAt: props.modificatedAt ? props.modificatedAt : new Date()
    };
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Client {
    const data: ClientDTO = snapshot.data(options) as ClientDTO;
    const client: Client = {
      uid: snapshot.id,
      props: {
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

export const participationConverter: FirestoreDataConverter<Participation> = {
  toFirestore(participation: Participation): WithFieldValue<DocumentData> {
    const { props } = participation;
    const data: ParticipationDTO = {
      tableUid: props.tableUid,
      clientUid: props.clientUid,
      active: props.active,
      scanned: props.scanned,
      createdAt: props.createdAt ? props.createdAt : new Date(),
      modificatedAt: props.modificatedAt ? props.modificatedAt : new Date()
    };
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Participation {
    const data: ParticipationDTO = snapshot.data(options) as ParticipationDTO;
    const participation: Participation = {
      uid: snapshot.id,
      props: {
        tableUid: data.tableUid,
        clientUid: data.clientUid,
        active: data.active,
        scanned: data.scanned,
        createdAt: new Date((data.createdAt as unknown as Timestamp).seconds * 1000),
        modificatedAt: new Date((data.modificatedAt as unknown as Timestamp).seconds * 1000)
      }
    };
    return participation;
  }
};
