import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  getFirestore,
  QueryConstraint,
  QueryDocumentSnapshot
} from '@angular/fire/firestore';
import { Read } from 'src/app/interface/read';
import {
  assignmentConverter,
  clientConverter,
  employeeConverter,
  eventConverter,
  tableConverter
} from 'src/app/models/converter';
import { Collection } from 'src/app/models/collection';
import { Assignment, Client, Employee, Event, Table } from 'src/app/models/type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseReadService implements Read {
  /* Firebase */
  private db!: Firestore;

  constructor() {
    this.db = getFirestore();
  }

  /* ------------------------------------------- EVENT ------------------------------------------- */
  public async getAllEvents(): Promise<Event[]> {
    const events: Event[] = [];
    const collectionRef = collection(this.db, Collection.EVENTS).withConverter(eventConverter);
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((eventDoc) => {
      events.push(eventDoc.data());
      if (!environment.production) console.info('Got event', eventDoc.data());
    });
    return events;
  }

  public async getEventByUid(eventUid: string): Promise<Event> {
    const collectionRef = collection(this.db, Collection.EVENTS).withConverter(eventConverter);
    const docRef = doc(collectionRef, eventUid);
    const docSnap = await getDoc(docRef);
    if (!environment.production) console.info('Got event', docSnap.data());
    return docSnap.data() as Event;
  }

  public async getEventsByMultipleConstraints(constraints: QueryConstraint[]): Promise<Event[]> {
    const events: Event[] = [];
    const collectionRef = collection(this.db, Collection.EVENTS).withConverter(eventConverter);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((eventDoc) => {
      events.push(eventDoc.data());
      if (!environment.production) console.info('Got event', eventDoc.data());
    });
    return events;
  }

  /* ------------------------------------------- ASSIGNMENT ------------------------------------------- */
  public async getAssignmentByUid(assignmentUid: string): Promise<Assignment> {
    const collectionRef = collection(this.db, Collection.ASSIGNMENTS).withConverter(assignmentConverter);
    const docRef = doc(collectionRef, assignmentUid);
    const docSnap = await getDoc(docRef);
    if (!environment.production) console.info('Got assignment', docSnap.data());
    return docSnap.data() as Assignment;
  }

  public async getAssignmentsByMultipleConstraints(constraints: QueryConstraint[]): Promise<Assignment[]> {
    const assignments: Assignment[] = [];
    const collectionRef = collection(this.db, Collection.ASSIGNMENTS).withConverter(assignmentConverter);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((item: QueryDocumentSnapshot<Assignment>) => {
      assignments.push(item.data());
      if (!environment.production) console.info('Got assignment', item.data());
    });
    return assignments;
  }

  /* ------------------------------------------- EMPLOYEE ------------------------------------------- */
  public async getAllEmployees(): Promise<Employee[]> {
    const employees: Employee[] = [];
    const collectionRef = collection(this.db, Collection.EMPLOYEES).withConverter(employeeConverter);
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((item: QueryDocumentSnapshot<Employee>) => {
      employees.push(item.data());
      if (!environment.production) console.info('Got employee', item.data());
    });
    return employees;
  }

  public async getEmployeeByUid(employeeUid: string): Promise<Employee> {
    const collectionRef = collection(this.db, Collection.EMPLOYEES).withConverter(employeeConverter);
    const docRef = doc(collectionRef, employeeUid);
    const docSnap = await getDoc(docRef);
    if (!environment.production) console.info('Got employee', docSnap.data());
    return docSnap.data() as Employee;
  }

  public async getEmployeesByMultipleConstraints(constraints: QueryConstraint[]): Promise<Employee[]> {
    const employees: Employee[] = [];
    const collectionRef = collection(this.db, Collection.EMPLOYEES).withConverter(employeeConverter);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((item: QueryDocumentSnapshot<Employee>) => {
      employees.push(item.data());
      if (!environment.production) console.info('Got employee', item.data());
    });
    return employees;
  }

  /* ------------------------------------------- TABLE ------------------------------------------- */
  public async getTableByUid(tableUid: string): Promise<Table> {
    const collectionRef = collection(this.db, Collection.TABLES).withConverter(tableConverter);
    const docRef = doc(collectionRef, tableUid);
    const docSnap = await getDoc(docRef);
    if (!environment.production) console.info('Got table', docSnap.data());
    return docSnap.data() as Table;
  }

  public async getTablesByMultipleConstraints(constraints: QueryConstraint[]): Promise<Table[]> {
    const tables: Table[] = [];
    const collectionRef = collection(this.db, Collection.TABLES).withConverter(tableConverter);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((item: QueryDocumentSnapshot<Table>) => {
      tables.push(item.data());
      if (!environment.production) console.info('Got table', item.data());
    });
    return tables;
  }

  /* ------------------------------------------- CLIENT ------------------------------------------- */
  public async getAllClients(): Promise<Client[]> {
    const clients: Client[] = [];
    const collectionRef = collection(this.db, Collection.CLIENTS).withConverter(clientConverter);
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((item: QueryDocumentSnapshot<Client>) => {
      clients.push(item.data());
      if (!environment.production) console.info('Got client', item.data());
    });
    return clients;
  }

  public async getClientByUid(clientUid: string): Promise<Client> {
    const collectionRef = collection(this.db, Collection.CLIENTS).withConverter(clientConverter);
    const docRef = doc(collectionRef, clientUid);
    const docSnap = await getDoc(docRef);
    if (!environment.production) console.info('Got client', docSnap.data());
    return docSnap.data() as Client;
  }
}
