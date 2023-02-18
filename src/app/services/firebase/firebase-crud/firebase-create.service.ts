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
import { Collection } from 'src/app/models/collection';
import { Assignment, Client, Employee, Event, Table } from 'src/app/models/type';
import { Participation } from '../../../models/type';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCreateService {
  /* Firebase */
  private db!: Firestore;

  constructor() {
    this.db = getFirestore();
  }

  public async addDocument(
    collectionName: Collection,
    data: Event | Assignment | Employee | Table | Participation | Client
  ): Promise<DocumentReference<DocumentData>> {
    const { props } = data;

    /* Sanitize props */
    Object.entries(props).forEach(([key, value]) => {
      if (!value) delete (props as any)[key];
    });
    props.createdAt = new Date();
    props.modifiedAt = new Date();

    const collectionRef = collection(this.db, collectionName);
    const docRef = await addDoc(collectionRef, props);
    return docRef;
  }

  public async addDocumentWithUid(
    collectionName: Collection,
    data: Event | Assignment | Employee | Table | Participation | Client
  ): Promise<DocumentReference<DocumentData>> {
    const { uid, props } = data;

    /* Sanitize props */
    Object.entries(props).forEach(([key, value]) => {
      if (!value) delete (props as any)[key];
    });
    props.createdAt = new Date();
    props.modifiedAt = new Date();

    const collectionRef = collection(this.db, collectionName);
    const docRef = doc(collectionRef, uid);
    await setDoc(docRef, props);
    return docRef;
  }

  public async addDocuments(
    collectionName: Collection,
    data: (Event | Assignment | Employee | Table | Participation | Client)[]
  ): Promise<void> {
    const batch = writeBatch(this.db);
    const collectionRef = collection(this.db, collectionName);
    data.forEach((document: Event | Assignment | Employee | Table | Participation | Client) => {
      const { props } = document;

      /* Sanitize props */
      Object.entries(props).forEach(([key, value]) => {
        if (!value) delete (props as any)[key];
      });
      props.createdAt = new Date();
      props.modifiedAt = new Date();

      const docRef = doc(collectionRef);
      batch.set(docRef, props);
    });
    await batch.commit();
  }
}
