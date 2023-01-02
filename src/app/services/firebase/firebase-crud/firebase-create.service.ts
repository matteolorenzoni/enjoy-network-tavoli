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
    const { eventDTO } = event;
    eventDTO.createdAt = new Date();
    eventDTO.modificatedAt = new Date();
    const collectionRef = collection(this.db, Collection.EVENTS);
    const docRef = await addDoc(collectionRef, eventDTO);
    if (!environment.production) console.info('Added event', eventDTO);
    return docRef;
  }

  /* ------------------------------------------- ASSIGNEMNET ------------------------------------------- */
  public async addAssignments(assignments: Assignment[]): Promise<void> {
    const batch = writeBatch(this.db);
    const collectionRef = collection(this.db, Collection.ASSIGNMENTS);
    assignments.forEach((assignment: Assignment) => {
      const { assignmentDTO } = assignment;
      assignmentDTO.createdAt = new Date();
      assignmentDTO.modificatedAt = new Date();
      const docRef = doc(collectionRef);
      batch.set(docRef, assignment.assignmentDTO);
      if (!environment.production) console.info('Added assignment', assignment.assignmentDTO);
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
    const { tableDTO } = table;
    tableDTO.createdAt = new Date();
    tableDTO.modificatedAt = new Date();
    tableDTO.personMarked = 0;
    tableDTO.personAssigned = 0;
    const collectionRef = collection(this.db, Collection.TABLES);
    const docRef = await addDoc(collectionRef, tableDTO);
    if (!environment.production) console.info('Added table', tableDTO);
    return docRef;
  }

  /* ------------------------------------------- CLIENT ------------------------------------------- */
  public async addClient(client: Client): Promise<DocumentReference<DocumentData>> {
    const { clientDTO } = client;
    clientDTO.createdAt = new Date();
    clientDTO.modificatedAt = new Date();
    const collectionRef = collection(this.db, Collection.CLIENTS);
    const docRef = await addDoc(collectionRef, clientDTO);
    if (!environment.production) console.info('Added client', clientDTO);
    return docRef;
  }
}
