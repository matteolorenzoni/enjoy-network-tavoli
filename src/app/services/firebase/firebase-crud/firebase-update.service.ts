import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, getFirestore, collection } from '@angular/fire/firestore';
import { AssignmentDTO, Collection } from 'src/app/models/collection';
import { Client, Employee, Event, Table } from 'src/app/models/type';
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
    const { uid, eventDTO } = event;
    eventDTO.modificatedAt = new Date();
    const collectionRef = collection(this.db, Collection.EVENTS);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, eventDTO);
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
    const { uid, tableDTO } = table;
    tableDTO.modificatedAt = new Date();
    const collectionRef = collection(this.db, Collection.TABLES);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, tableDTO);
    if (!environment.production) console.info('Updated table', table);
  }

  /* ------------------------------------------- CLIENT  ------------------------------------------- */
  public async updateClient(client: Client): Promise<void> {
    const { uid, clientDTO } = client;
    clientDTO.modificatedAt = new Date();
    const collectionRef = collection(this.db, Collection.CLIENTS);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, clientDTO);
    if (!environment.production) console.info('Updated client', client);
  }
}
