import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, getFirestore, collection } from '@angular/fire/firestore';
import { Collection } from 'src/app/models/collection';
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

  public async updateDocument(
    collectionName: Collection,
    data: Event | Assignment | Employee | Table | Participation | Client
  ): Promise<void> {
    const { uid, props } = data;
    props.modificatedAt = new Date();
    const collectionRef = collection(this.db, collectionName);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, props);
    if (!environment.production) console.info('Updated document', data);
  }

  public async updateDocumentProps(
    collectionName: Collection,
    data: Event | Assignment | Employee | Table | Participation | Client,
    props: Partial<typeof data.props>
  ): Promise<void> {
    const { uid } = data;
    const collectionRef = collection(this.db, collectionName);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, props);
    if (!environment.production) console.info('Updated document props', data);
  }
}
