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
import { Table } from 'src/app/models/table';
import { environment } from 'src/environments/environment';
import { Assignment, Employee, Event } from 'src/app/models/type';

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
    const collectionRef = collection(this.db, Table.EVENTS);
    const docRef = await addDoc(collectionRef, eventDTO);
    if (!environment.production) console.info('Added event', eventDTO);
    return docRef;
  }

  /* ------------------------------------------- ASSIGNEMNET ------------------------------------------- */
  public async addAssignments(assignments: Assignment[]): Promise<void> {
    const batch = writeBatch(this.db);
    const collectionRef = collection(this.db, Table.ASSIGNMENTS);
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
    const collectionRef = collection(this.db, Table.EMPLOYEES);
    const docRef = doc(collectionRef, uid);
    await setDoc(docRef, employeeDTO);
    if (!environment.production) console.info('Added employee', employeeDTO);
  }
}
