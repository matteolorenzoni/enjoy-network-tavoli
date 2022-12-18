import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, getFirestore, collection } from '@angular/fire/firestore';
import { Table } from 'src/app/models/table';
import { Employee, Event } from 'src/app/models/type';
import { environment } from 'src/environments/environment';
import { EventEmployeeDTO } from '../../models/table';

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
  public async updateEventEmployeeProps(
    eventUid: string,
    eventEmployeeUid: string,
    propsToUpdate: { [key in keyof Partial<EventEmployeeDTO>]: any }
  ): Promise<void> {
    const collectionRef = collection(this.db, `${Table.EVENT_EMPLOYEES}/${eventUid}/${Table.EMPLOYEES}`);
    const docRef = doc(collectionRef, eventEmployeeUid);
    await updateDoc(docRef, propsToUpdate);
    if (!environment.production) console.info('Updated event employee', eventEmployeeUid);
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
