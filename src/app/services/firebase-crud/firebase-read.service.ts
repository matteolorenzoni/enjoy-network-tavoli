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
  QueryConstraint
} from '@angular/fire/firestore';
import { Table } from 'src/app/models/table';
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
  public async getAllEmployee(): Promise<QuerySnapshot<DocumentData>> {
    const collectionRef = collection(this.db, Table.EMPLOYEES);
    const querySnapshot = await getDocs(collectionRef);
    if (!environment.production) {
      console.info(
        'Got employees',
        querySnapshot.docs.map((item) => item.data())
      );
    }
    return querySnapshot;
  }

  public async getEmployeeByUid(uid: string): Promise<DocumentSnapshot<DocumentData>> {
    const docRef = doc(this.db, Table.EMPLOYEES, uid);
    const docSnap = await getDoc(docRef);
    if (!environment.production) console.info('Got employee', docSnap.data());
    return docSnap;
  }

  public async getEmployeesByMultipleConstraints(constraints: QueryConstraint[]): Promise<QuerySnapshot<DocumentData>> {
    const collectionRef = collection(this.db, Table.EMPLOYEES);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    if (!environment.production) {
      console.info(
        'Got employees',
        querySnapshot.docs.map((item) => item.data())
      );
    }
    return querySnapshot;
  }
}
