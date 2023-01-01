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
import { assignmentConverter, employeeConverter, eventConverter } from 'src/app/models/converter';
import { Collection } from 'src/app/models/collection';
import { Assignment, Employee, Event } from 'src/app/models/type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseReadService {
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

  public async getEventByUid(uid: string): Promise<Event> {
    const collectionRef = collection(this.db, Collection.EVENTS).withConverter(eventConverter);
    const docRef = doc(collectionRef, uid);
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

  public async getEmployeeByUid(uid: string): Promise<Employee> {
    const collectionRef = collection(this.db, Collection.EMPLOYEES).withConverter(employeeConverter);
    const docRef = doc(collectionRef, uid);
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
}
