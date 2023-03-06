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
      email: props.email,
      zone: props.zone,
      isActive: props.isActive,
      createdAt: props.createdAt || new Date(),
      modifiedAt: props.modifiedAt || new Date()
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
        email: data.email,
        zone: data.zone,
        isActive: data.isActive,
        createdAt: data.createdAt && new Date((data.createdAt as unknown as Timestamp).seconds * 1000),
        modifiedAt: data.createdAt && new Date((data.modifiedAt as unknown as Timestamp).seconds * 1000)
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
      code: props.code,
      name: props.name,
      date: props.date,
      timeStart: props.timeStart,
      timeEnd: props.timeEnd,
      maxPerson: props.maxPerson,
      place: props.place,
      guest: props.guest,
      description: props.description,
      message: props.message,
      createdAt: props.createdAt || new Date(),
      modifiedAt: props.modifiedAt || new Date()
    };
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Event {
    const data: EventDTO = snapshot.data(options) as EventDTO;
    const event: Event = {
      uid: snapshot.id,
      props: {
        imageUrl: data.imageUrl,
        code: data.code,
        name: data.name,
        date: data.date && new Date((data.date as unknown as Timestamp).seconds * 1000),
        timeStart: data.timeStart,
        timeEnd: data.timeEnd,
        maxPerson: data.maxPerson,
        place: data.place,
        guest: data.guest,
        description: data.description,
        message: data.message,
        createdAt: data.createdAt && new Date((data.createdAt as unknown as Timestamp).seconds * 1000),
        modifiedAt: data.createdAt && new Date((data.modifiedAt as unknown as Timestamp).seconds * 1000)
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
      personMarked: props.personMarked,
      maxPersonMarkable: props.maxPersonMarkable,
      isActive: props.isActive,
      createdAt: props.createdAt || new Date(),
      modifiedAt: props.modifiedAt || new Date()
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
        personMarked: data.personMarked,
        maxPersonMarkable: data.maxPersonMarkable,
        isActive: data.isActive,
        createdAt: data.modifiedAt && new Date((data.createdAt as unknown as Timestamp).seconds * 1000),
        modifiedAt: data.modifiedAt && new Date((data.modifiedAt as unknown as Timestamp).seconds * 1000)
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
      drinkList: props.drinkList,
      isActive: props.isActive,
      createdAt: props.createdAt || new Date(),
      modifiedAt: props.modifiedAt || new Date()
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
        hour: data.hour && new Date((data.hour as unknown as Timestamp).seconds * 1000),
        drinkList: data.drinkList,
        isActive: data.isActive,
        createdAt: data.createdAt && new Date((data.createdAt as unknown as Timestamp).seconds * 1000),
        modifiedAt: data.modifiedAt && new Date((data.modifiedAt as unknown as Timestamp).seconds * 1000)
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
      createdAt: props.createdAt || new Date(),
      modifiedAt: props.modifiedAt || new Date()
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
        createdAt: data.createdAt && new Date((data.createdAt as unknown as Timestamp).seconds * 1000),
        modifiedAt: data.modifiedAt && new Date((data.modifiedAt as unknown as Timestamp).seconds * 1000)
      }
    };
    return client;
  }
};

export const participationConverter: FirestoreDataConverter<Participation> = {
  toFirestore(participation: Participation): WithFieldValue<DocumentData> {
    const { props } = participation;
    const data: ParticipationDTO = {
      eventUid: props.eventUid,
      tableUid: props.tableUid,
      name: props.name,
      lastName: props.lastName,
      phone: props.phone,
      scannedAt: props.scannedAt,
      scannedFrom: props.scannedFrom,
      messageIsReceived: props.messageIsReceived,
      errorIfMessageIsNotReceived: props.errorIfMessageIsNotReceived,
      isActive: props.isActive,
      createdAt: props.createdAt || new Date(),
      modifiedAt: props.modifiedAt || new Date()
    };
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Participation {
    const data: ParticipationDTO = snapshot.data(options) as ParticipationDTO;
    const participation: Participation = {
      uid: snapshot.id,
      props: {
        eventUid: data.eventUid,
        tableUid: data.tableUid,
        name: data.name,
        lastName: data.lastName,
        phone: data.phone,
        scannedAt: data.scannedAt && new Date((data.scannedAt as unknown as Timestamp).seconds * 1000),
        scannedFrom: data.scannedFrom,
        messageIsReceived: data.messageIsReceived,
        errorIfMessageIsNotReceived: data.errorIfMessageIsNotReceived,
        isActive: data.isActive,
        createdAt: data.createdAt && new Date((data.createdAt as unknown as Timestamp).seconds * 1000),
        modifiedAt: data.modifiedAt && new Date((data.modifiedAt as unknown as Timestamp).seconds * 1000)
      }
    };
    return participation;
  }
};
