import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  getFirestore,
  QueryConstraint,
  QueryDocumentSnapshot,
  FirestoreDataConverter
} from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseReadService {
  /* Firebase */
  private db!: Firestore;

  constructor() {
    this.db = getFirestore();
  }

  /* Get a single document by its uid */
  public async getDocumentByUid<T>(
    collectionName: string,
    documentUid: string,
    converter: FirestoreDataConverter<T>
  ): Promise<T> {
    const collectionRef = collection(this.db, collectionName).withConverter(converter);
    const docRef = doc(collectionRef, documentUid);
    const docSnap = await getDoc(docRef);

    /* If the document does not exist, throw an error */
    if (!docSnap.exists()) throw new Error('No such document!');

    /* Return the document */
    if (!environment.production) console.info('Got document', docSnap.data());
    return docSnap.data() as T;
  }

  /* Get all documents in a collection */
  public async getAllDocuments<T>(collectionName: string, converter: FirestoreDataConverter<T>): Promise<T[]> {
    const documents: T[] = [];
    const collectionRef = collection(this.db, collectionName).withConverter(converter);
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((item: QueryDocumentSnapshot<T>) => {
      documents.push(item.data());
      if (!environment.production) console.info('Got document', item.data());
    });
    return documents;
  }

  /* Get all documents in a collection that match the constraints */
  public async getDocumentsByMultipleConstraints<T>(
    collectionName: string,
    constraints: QueryConstraint[],
    converter: FirestoreDataConverter<T>
  ): Promise<T[]> {
    const documents: T[] = [];
    const collectionRef = collection(this.db, collectionName).withConverter(converter);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((item: QueryDocumentSnapshot<T>) => {
      documents.push(item.data());
      if (!environment.production) console.info('Got document', item.data());
    });
    return documents;
  }
}
