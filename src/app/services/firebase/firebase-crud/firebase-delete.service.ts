import { Injectable } from '@angular/core';
import { Firestore, doc, deleteDoc, getFirestore, collection, writeBatch } from '@angular/fire/firestore';
import { Collection } from 'src/app/models/collection';
import { environment } from 'src/environments/environment';
import { Assignment } from '../../../models/type';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDeleteService {
  /* Firebase */
  private db!: Firestore;

  constructor() {
    this.db = getFirestore();
  }

  /* ------------------------------------------- EVENT ------------------------------------------- */
  public async deleteEventByUid(eventUid: string): Promise<void> {
    const collectionRef = collection(this.db, Collection.EVENTS);
    const docRef = doc(collectionRef, eventUid);
    await deleteDoc(docRef);
    if (!environment.production) console.info('Evento eliminato:', eventUid);
  }

  /* ------------------------------------------- ASSIGNMENT ------------------------------------------- */
  public async deleteAssignments(assignments: Assignment[]): Promise<void> {
    const batch = writeBatch(this.db);
    const collectionRef = collection(this.db, Collection.ASSIGNMENTS);
    assignments.forEach((assignment: Assignment) => {
      const docRef = doc(collectionRef, assignment.uid);
      batch.delete(docRef);
    });
    await batch.commit();
    if (!environment.production) console.info('Assignment eliminati:', assignments);
  }

  /* ------------------------------------------- EMPLOYEE ------------------------------------------- */
  public async deleteEmployeeByUid(employeeUid: string): Promise<void> {
    const collectionRef = collection(this.db, Collection.EMPLOYEES);
    const docRef = doc(collectionRef, employeeUid);
    await deleteDoc(docRef);
    if (!environment.production) console.info('Employee eliminato:', employeeUid);
  }

  /* ------------------------------------------- TABLE ------------------------------------------- */
  public async deleteTableByUid(tableUid: string): Promise<void> {
    const collectionRef = collection(this.db, Collection.TABLES);
    const docRef = doc(collectionRef, tableUid);
    await deleteDoc(docRef);
    if (!environment.production) console.info('Tavolo eliminato:', tableUid);
  }

  /* ------------------------------------------- CLIENT ------------------------------------------- */
  public async deleteClientByUid(clientUid: string): Promise<void> {
    const collectionRef = collection(this.db, Collection.CLIENTS);
    const docRef = doc(collectionRef, clientUid);
    await deleteDoc(docRef);
    if (!environment.production) console.info('Cliente eliminato:', clientUid);
  }
}
