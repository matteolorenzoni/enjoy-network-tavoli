import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, getFirestore, collection } from '@angular/fire/firestore';
import { AssignmentDTO, Collection, ParticipationDTO } from 'src/app/models/collection';
import { Client, Employee, Event, Participation, Table } from 'src/app/models/type';
import { environment } from 'src/environments/environment';
import { Assignment } from '../../../models/type';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUpdateService {
  /* Firebase */
  private db!: Firestore;

  constructor() {
    this.db = getFirestore();
  }

  /* ------------------------------------------- EVENT ------------------------------------------- */
  public async updateEvent(event: Event): Promise<void> {
    const { uid, props } = event;
    props.modificatedAt = new Date();
    const collectionRef = collection(this.db, Collection.EVENTS);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, props);
    if (!environment.production) console.info('Updated event', event);
  }

  /* ------------------------------------------- ASSIGNEMNT ------------------------------------------- */
  public async updateAssignmentProps(
    assignment: Assignment,
    propsToUpdate: { [key in keyof Partial<AssignmentDTO>]: any }
  ): Promise<void> {
    const { uid } = assignment;
    const collectionRef = collection(this.db, Collection.ASSIGNMENTS);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, { ...propsToUpdate, modificatedAt: new Date() });
    if (!environment.production) console.info('Updated assignment', assignment);
  }

  /* ------------------------------------------- EMPLOYEE ------------------------------------------- */
  public async updateEmployee(employee: Employee): Promise<void> {
    const { uid, employeeDTO } = employee;
    employeeDTO.modificatedAt = new Date();
    const collectionRef = collection(this.db, Collection.EMPLOYEES);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, employeeDTO);
    if (!environment.production) console.info('Updated employee', employee);
  }

  /* ------------------------------------------- TABLE ------------------------------------------- */
  public async updateTable(table: Table): Promise<void> {
    const { uid, props } = table;
    props.modificatedAt = new Date();
    const collectionRef = collection(this.db, Collection.TABLES);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, props);
    if (!environment.production) console.info('Updated table', table);
  }

  public async updateTableProps(
    tableUid: string,
    propsToUpdate: { [key in keyof Partial<Table>]: any }
  ): Promise<void> {
    const collectionRef = collection(this.db, Collection.TABLES);
    const docRef = doc(collectionRef, tableUid);
    await updateDoc(docRef, { ...propsToUpdate, modificatedAt: new Date() });
    if (!environment.production) console.info('Updated table', tableUid);
  }

  /* ------------------------------------------- PARTICIPATION ------------------------------------------- */
  public async updateParticipationProps(
    participation: Participation,
    propsToUpdate: { [key in keyof Partial<ParticipationDTO>]: any }
  ): Promise<void> {
    const { uid } = participation;
    const collectionRef = collection(this.db, Collection.PARTICIPATIONS);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, { ...propsToUpdate, modificatedAt: new Date() });
    if (!environment.production) console.info('Updated participation', participation);
  }

  /* ------------------------------------------- CLIENT  ------------------------------------------- */
  public async updateClient(client: Client): Promise<void> {
    const { uid, props } = client;
    props.modificatedAt = new Date();
    const collectionRef = collection(this.db, Collection.CLIENTS);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, props);
    if (!environment.production) console.info('Updated client', client);
  }
}
