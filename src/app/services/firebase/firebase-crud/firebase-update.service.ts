import { Injectable } from '@angular/core';
import { Client, Employee, Event, Participation, Table } from 'src/app/models/type';
import { Firestore, deleteField, collection, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { LoaderService } from '../../loader.service';
import { Assignment } from '../../../models/type';
import { InitializeService } from '../initialize.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUpdateService {
  private db: Firestore;

  constructor(private initializeService: InitializeService, private loaderService: LoaderService) {
    this.db = this.initializeService.getDb();
  }

  public async updateDocument(
    collectionName: string,
    data: Event | Assignment | Employee | Table | Participation | Client
  ): Promise<void> {
    this.loaderService.show();

    const { uid, props } = data;

    /* Sanitize props */
    Object.entries(props).forEach(([key, value]) => {
      if (value === null || value === undefined) (props as any)[key] = deleteField();
    });
    props.modifiedAt = new Date();

    const collectionRef = collection(this.db, collectionName);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, props);

    this.loaderService.hide();
  }

  public async updateDocuments(
    collectionName: string,
    data: Event[] | Assignment[] | Employee[] | Table[] | Participation[] | Client[]
  ): Promise<void> {
    this.loaderService.show();

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

    this.loaderService.hide();
  }

  public async updateDocumentProps(collectionName: string, uid: string, props: any): Promise<void> {
    this.loaderService.show();

    const propsUpdated = { ...props, modifiedAt: new Date() };
    const collectionRef = collection(this.db, collectionName);
    const docRef = doc(collectionRef, uid);
    await updateDoc(docRef, propsUpdated);

    this.loaderService.hide();
  }

  public async updateDocumentsProps(
    collectionName: string,
    data: Event[] | Assignment[] | Employee[] | Table[] | Participation[] | Client[],
    props: Partial<typeof data[0]['props']>
  ): Promise<void> {
    this.loaderService.show();

    const propsUpdated = { ...props, modifiedAt: new Date() };
    const batch = writeBatch(this.db);
    const collectionRef = collection(this.db, collectionName);
    data.forEach((item) => {
      const docRef = doc(collectionRef, item.uid);
      batch.update(docRef, propsUpdated);
    });
    await batch.commit();

    this.loaderService.hide();
  }
}
