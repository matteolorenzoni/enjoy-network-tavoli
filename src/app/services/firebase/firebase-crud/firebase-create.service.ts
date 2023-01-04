import { Injectable } from '@angular/core';
import {
  DocumentData,
  DocumentReference,
  Firestore,
  addDoc,
  getFirestore,
  collection,
  writeBatch,
  doc,
  setDoc
} from '@angular/fire/firestore';
import { Collection } from 'src/app/models/collection';
import { environment } from 'src/environments/environment';
import { Assignment, Client, Employee, Event, Table } from 'src/app/models/type';
import { Participation } from '../../../models/type';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCreateService {
  /* Firebase */
  private db!: Firestore;

  constructor() {
    this.db = getFirestore();
  }

  /* ------------------------------------------- EVENT ------------------------------------------- */
  public async addEvent(event: Event): Promise<DocumentReference<DocumentData>> {
    const { props } = event;
    props.createdAt = new Date();
    props.modificatedAt = new Date();
    const collectionRef = collection(this.db, Collection.EVENTS);
    const docRef = await addDoc(collectionRef, props);
    if (!environment.production) console.info('Added event', props);
    return docRef;
  }

  /* ------------------------------------------- ASSIGNEMNET ------------------------------------------- */
  public async addAssignments(assignments: Assignment[]): Promise<void> {
    const batch = writeBatch(this.db);
    const collectionRef = collection(this.db, Collection.ASSIGNMENTS);
    assignments.forEach((assignment: Assignment) => {
      const { props } = assignment;
      props.createdAt = new Date();
      props.modificatedAt = new Date();
      const docRef = doc(collectionRef);
      batch.set(docRef, assignment.props);
      if (!environment.production) console.info('Added assignment', assignment.props);
    });
    await batch.commit();
  }

  /* ------------------------------------------- EMPLOYEE ------------------------------------------- */
  public async addEmployee(employee: Employee): Promise<void> {
    const { uid, employeeDTO } = employee;
    employeeDTO.createdAt = new Date();
    employeeDTO.modificatedAt = new Date();
    const collectionRef = collection(this.db, Collection.EMPLOYEES);
    const docRef = doc(collectionRef, uid);
    await setDoc(docRef, employeeDTO);
    if (!environment.production) console.info('Added employee', employeeDTO);
  }

  /* ------------------------------------------- TABLE ------------------------------------------- */
  public async addTable(table: Table): Promise<DocumentReference<DocumentData>> {
    const { props } = table;
    props.createdAt = new Date();
    props.modificatedAt = new Date();
    props.personMarked = 0;
    props.personAssigned = 0;
    const collectionRef = collection(this.db, Collection.TABLES);
    const docRef = await addDoc(collectionRef, props);
    if (!environment.production) console.info('Added table', props);
    return docRef;
  }

  /* ------------------------------------------- PARTICIPATION ------------------------------------------- */
  public async addParticipation(participation: Participation): Promise<DocumentReference<DocumentData>> {
    const { props } = participation;
    props.createdAt = new Date();
    props.modificatedAt = new Date();
    const collectionRef = collection(this.db, Collection.PARTICIPATIONS);
    const docRef = await addDoc(collectionRef, props);
    if (!environment.production) console.info('Added partecipation', props);
    return docRef;
  }

  /* ------------------------------------------- CLIENT ------------------------------------------- */
  public async addClient(client: Client): Promise<DocumentReference<DocumentData>> {
    const { props } = client;
    props.createdAt = new Date();
    props.modificatedAt = new Date();
    const collectionRef = collection(this.db, Collection.CLIENTS);
    const docRef = await addDoc(collectionRef, props);
    if (!environment.production) console.info('Added client', props);
    return docRef;
  }
}
