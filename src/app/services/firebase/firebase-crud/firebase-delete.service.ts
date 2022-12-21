import { Injectable } from '@angular/core';
import { Firestore, doc, deleteDoc, getFirestore, collection, writeBatch } from '@angular/fire/firestore';
import { deleteObject, FirebaseStorage, getStorage, ref } from '@angular/fire/storage';
import { Table } from 'src/app/models/table';
import { environment } from 'src/environments/environment';
import { Assignment } from '../../../models/type';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDeleteService {
  /* Firebase */
  private db!: Firestore;
  private storage!: FirebaseStorage;

  constructor() {
    this.db = getFirestore();
    this.storage = getStorage();
  }

  /* ------------------------------------------- EVENT ------------------------------------------- */
  public async deleteEventByUid(eventUid: string): Promise<void> {
    const collectionRef = collection(this.db, Table.EVENTS);
    const docRef = doc(collectionRef, eventUid);
    await deleteDoc(docRef);
    if (!environment.production) console.info('Evento eliminato:', eventUid);
  }

  public async deletePhoto(imageUrl: string): Promise<void> {
    const storageRef = ref(this.storage, `events/${imageUrl}`);
    await deleteObject(storageRef);
    if (!environment.production) console.info('Foto eliminata:', imageUrl);
  }

  /* ------------------------------------------- ASSIGNMENT ------------------------------------------- */
  public async deleteAssignments(assignments: Assignment[]): Promise<void> {
    const batch = writeBatch(this.db);
    const collectionRef = collection(this.db, Table.ASSIGNMENTS);
    assignments.forEach((assignment: Assignment) => {
      const docRef = doc(collectionRef, assignment.uid);
      batch.delete(docRef);
    });
    await batch.commit();
    if (!environment.production) console.info('Assignment eliminati:', assignments);
  }

  /* ------------------------------------------- EMPLOYEE ------------------------------------------- */
  public async deleteEmployeeByUid(employeeUid: string): Promise<void> {
    const collectionRef = collection(this.db, Table.EMPLOYEES);
    const docRef = doc(collectionRef, employeeUid);
    await deleteDoc(docRef);
    if (!environment.production) console.info('Employee eliminato:', employeeUid);
  }
}
