import { Injectable } from '@angular/core';
import { Assignment, Client, CustomError, Employee, Event, Table } from 'src/app/models/type';
import { Firestore, DocumentReference, DocumentData, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { Participation } from '../../../models/type';
import { LoaderService } from '../../loader.service';
import { InitializeService } from '../initialize.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCreateService {
  private db: Firestore;

  constructor(private initializeService: InitializeService, private loaderService: LoaderService) {
    this.db = this.initializeService.getDb();
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
