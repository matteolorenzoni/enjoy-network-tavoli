import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, getFirestore, collection } from '@angular/fire/firestore';
import { AssignmentDTO, Table } from 'src/app/models/table';
import { Employee, Event } from 'src/app/models/type';
import { environment } from 'src/environments/environment';

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
    const collectionRef = collection(this.db, Table.EVENTS);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, eventDTO);
    if (!environment.production) console.info('Updated event', eventDTO);
  }

  /* ------------------------------------------- EVENT EMPLOYEE ------------------------------------------- */
  public async updateAssignmentProps(
    eventUid: string,
    assignmentUid: string,
    propsToUpdate: { [key in keyof Partial<AssignmentDTO>]: any }
  ): Promise<void> {
    const collectionRef = collection(this.db, `${Table.ASSIGNMENTS}/${eventUid}/${Table.EMPLOYEES}`);
    const docRef = doc(collectionRef, assignmentUid);
    await updateDoc(docRef, propsToUpdate);
    if (!environment.production) console.info('Updated event employee', assignmentUid);
  }

  /* ------------------------------------------- EMPLOYEE ------------------------------------------- */
  // CHECK
  public async updateEmployee(employee: Employee): Promise<void> {
    const { uid, employeeDTO } = employee;
    employeeDTO.modificatedAt = new Date();
    const docRef = doc(this.db, Table.EMPLOYEES, uid);
    await updateDoc(docRef, employeeDTO);
    if (!environment.production) console.info('Updated employee', employeeDTO);
  }
}
