import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  DocumentData,
  DocumentSnapshot,
  collection,
  getDocs,
  QuerySnapshot,
  query,
  getFirestore,
  QueryConstraint,
  QueryDocumentSnapshot
} from '@angular/fire/firestore';
import { employeeConverter } from 'src/app/models/converter';
import { Table } from 'src/app/models/table';
import { Employee } from 'src/app/models/type';
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
  public async getAllEvents(): Promise<QuerySnapshot<DocumentData>> {
    const collectionRef = collection(this.db, Table.EVENTS);
    const querySnapshot = await getDocs(collectionRef);
    if (!environment.production) {
      console.info(
        'Got events',
        querySnapshot.docs.map((item) => item.data())
      );
    }
    return querySnapshot;
  }

  public async getEventByUid(uid: string): Promise<DocumentSnapshot<DocumentData>> {
    const collectionRef = collection(this.db, Table.EVENTS);
    const docRef = doc(collectionRef, uid);
    const docSnap = await getDoc(docRef);
    if (!environment.production) console.info('Got event', docSnap.data());
    return docSnap;
  }

  /* ------------------------------------------- EVENT EMPLOYEE ------------------------------------------- */
  public async getAllEventEmployees(eventUid: string): Promise<QuerySnapshot<DocumentData>> {
    const collectionRef = collection(this.db, `${Table.EVENT_EMPLOYEES}/${eventUid}/${Table.EMPLOYEES}`);
    const querySnapshot = await getDocs(collectionRef);
    if (!environment.production) {
      console.info(
        'Got event employees',
        querySnapshot.docs.map((item) => item.data())
      );
    }
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
