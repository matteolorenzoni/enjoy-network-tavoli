import { Injectable } from '@angular/core';
import { Firestore, doc, getFirestore, collection, writeBatch, deleteField, updateDoc } from '@angular/fire/firestore';
import { Client, Employee, Event, Participation, Table } from 'src/app/models/type';
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

  public async updateDocument(
    collectionName: string,
    data: Event | Assignment | Employee | Table | Participation | Client
  ): Promise<void> {
    const { uid, props } = data;

    /* Sanitize props */
    Object.entries(props).forEach(([key, value]) => {
      if (value === null || value === undefined) (props as any)[key] = deleteField();
    });
    props.modifiedAt = new Date();

    const collectionRef = collection(this.db, collectionName);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, props);
  }

  public async updateDocuments(
    collectionName: string,
    data: Event[] | Assignment[] | Employee[] | Table[] | Participation[] | Client[]
  ): Promise<void> {
    const batch = writeBatch(this.db);
    const collectionRef = collection(this.db, collectionName);
    data.forEach((item) => {
      const { uid, props } = item;

      /* Sanitize props */
      Object.entries(props).forEach(([key, value]) => {
        if (value === null || value === undefined) (props as any)[key] = deleteField();
      });
      props.modifiedAt = new Date();

      const docRef = doc(collectionRef, uid);
      batch.update(docRef, props);
    });
    await batch.commit();
  }

  public async updateDocumentProps(collectionName: string, uid: string, props: any): Promise<void> {
    const propsUpdated = { ...props, modifiedAt: new Date() };
    const collectionRef = collection(this.db, collectionName);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, propsUpdated);
  }

  public async updateDocumentsProps(
    collectionName: string,
    data: Event[] | Assignment[] | Employee[] | Table[] | Participation[] | Client[],
    props: Partial<typeof data[0]['props']>
  ): Promise<void> {
    const propsUpdated = { ...props, modifiedAt: new Date() };
    const batch = writeBatch(this.db);
    const collectionRef = collection(this.db, collectionName);
    data.forEach((item) => {
      const docRef = doc(collectionRef, item.uid);
      batch.update(docRef, propsUpdated);
    });
    await batch.commit();
  }
}
