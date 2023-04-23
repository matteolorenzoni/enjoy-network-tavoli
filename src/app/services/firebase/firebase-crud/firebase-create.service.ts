import { Injectable } from '@angular/core';
import {
  DocumentData,
  DocumentReference,
  Firestore,
  addDoc,
  getFirestore,
  collection,
  doc,
  setDoc
} from '@angular/fire/firestore';
import { Assignment, Client, CustomError, Employee, Event, Table } from 'src/app/models/type';
import { Participation } from '../../../models/type';
import { LoaderService } from '../../loader.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCreateService {
  /* Firebase */
  private db!: Firestore;

  constructor(private loaderService: LoaderService) {
    this.db = getFirestore();
  }

  public async addDocument(
    collectionName: string,
    data: Event | Assignment | Employee | Table | Participation | Client | CustomError
  ): Promise<DocumentReference<DocumentData>> {
    this.loaderService.show();

    const { props } = data;

    /* Sanitize props */
    Object.entries(props).forEach(([key, value]) => {
      if (value === null || value === undefined) delete (props as any)[key];
    });
    props.createdAt = new Date();
    props.modifiedAt = new Date();

    const collectionRef = collection(this.db, collectionName);
    const docRef = await addDoc(collectionRef, props);

    this.loaderService.hide();
    return docRef;
  }

  public async addDocumentWithUid(
    collectionName: string,
    data: Event | Assignment | Employee | Table | Participation | Client | CustomError
  ): Promise<DocumentReference<DocumentData>> {
    this.loaderService.show();

    const { uid, props } = data;

    /* Sanitize props */
    Object.entries(props).forEach(([key, value]) => {
      if (value === null || value === undefined) delete (props as any)[key];
    });
    props.createdAt = new Date();
    props.modifiedAt = new Date();

    const collectionRef = collection(this.db, collectionName);
    const docRef = doc(collectionRef, uid);
    await setDoc(docRef, props);

    this.loaderService.hide();

    return docRef;
  }
}
