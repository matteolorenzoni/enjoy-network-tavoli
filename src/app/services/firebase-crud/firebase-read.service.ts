import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  DocumentData,
  collection,
  getDocs,
  QuerySnapshot,
  query,
  getFirestore,
  QueryConstraint,
  QueryDocumentSnapshot
} from '@angular/fire/firestore';
import { employeeConverter, eventConverter } from 'src/app/models/converter';
import { Table } from 'src/app/models/table';
import { Employee, Event } from 'src/app/models/type';
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
    const collectionRef = collection(this.db, Table.EVENTS).withConverter(eventConverter);
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((eventDoc) => {
      events.push(eventDoc.data());
      if (!environment.production) console.info('Got event', eventDoc.data());
    });
    return events;
  }

  public async getEventByUid(uid: string): Promise<Event> {
    const collectionRef = collection(this.db, Table.EVENTS).withConverter(eventConverter);
    const docRef = doc(collectionRef, uid);
    const docSnap = await getDoc(docRef);
    if (!environment.production) console.info('Got event', docSnap.data());
    return docSnap.data() as Event;
  }

  /* ------------------------------------------- ASSIGNMENT ------------------------------------------- */
  public async getAllAssignments(eventUid: string): Promise<QuerySnapshot<DocumentData>> {
    const collectionRef = collection(this.db, `${Table.ASSIGNMENTS}/${eventUid}/${Table.EMPLOYEES}`);
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot;
  }

  /* ------------------------------------------- EMPLOYEE ------------------------------------------- */
  public async getAllEmployee(): Promise<Employee[]> {
    const employees: Employee[] = [];
    const collectionRef = collection(this.db, Table.EMPLOYEES).withConverter(employeeConverter);
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((item: QueryDocumentSnapshot<Employee>) => {
      employees.push(item.data());
      if (!environment.production) console.info('Got employee', item.data());
    });
    return employees;
  }

  public async getEmployeeByUid(uid: string): Promise<Employee> {
    const docRef = doc(this.db, Table.EMPLOYEES, uid).withConverter(employeeConverter);
    const docSnap = await getDoc(docRef);
    if (!environment.production) console.info('Got employee', docSnap.data());
    return docSnap.data() as Employee;
  }

  public async getEmployeesByMultipleConstraints(constraints: QueryConstraint[]): Promise<Employee[]> {
    const employees: Employee[] = [];
    const collectionRef = collection(this.db, Table.EMPLOYEES).withConverter(employeeConverter);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((item: QueryDocumentSnapshot<Employee>) => {
      employees.push(item.data());
      if (!environment.production) console.info('Got employee', item.data());
    });
    return employees;
  }
}
