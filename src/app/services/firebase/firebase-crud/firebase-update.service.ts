import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, getFirestore, collection, writeBatch, setDoc } from '@angular/fire/firestore';
import { Collection } from 'src/app/models/collection';
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
    collectionName: Collection,
    data: Event | Assignment | Employee | Table | Participation | Client
  ): Promise<void> {
    const { uid, props } = data;
    const collectionRef = collection(this.db, collectionName);
    const docRef = doc(collectionRef, uid);
    await setDoc(docRef, props);
  }

  public async updateDocumentProps(
    collectionName: Collection,
    data: Event | Assignment | Employee | Table | Participation | Client,
    props: Partial<typeof data['props']>
  ): Promise<void> {
    const { uid } = data;
    const collectionRef = collection(this.db, collectionName);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, props);
  }

  public async updateDocumentsProp(
    collectionName: Collection,
    data: Event[] | Assignment[] | Employee[] | Table[] | Participation[] | Client[],
    prop: Partial<typeof data[0]['props']>
  ): Promise<void> {
    const batch = writeBatch(this.db);
    const collectionRef = collection(this.db, collectionName);
    data.forEach((item) => {
      const docRef = doc(collectionRef, item.uid);
      batch.update(docRef, prop);
    });
    await batch.commit();
  }
}
