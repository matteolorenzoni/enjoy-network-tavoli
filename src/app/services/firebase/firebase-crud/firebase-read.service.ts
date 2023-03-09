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
  FirestoreDataConverter,
  getCountFromServer,
  AggregateField,
  AggregateQuerySnapshot,
  onSnapshot
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
    if (!docSnap.exists()) throw new Error('Documento non trovato!');

    /* Return the document */
    return docSnap.data() as T;
  }

  /* Get all documents in a collection */
  public async getAllDocuments<T>(collectionName: string, converter: FirestoreDataConverter<T>): Promise<T[]> {
    const documents: T[] = [];
    const collectionRef = collection(this.db, collectionName).withConverter(converter);
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((item: QueryDocumentSnapshot<T>) => {
      documents.push(item.data());
    });
    return documents;
  }

  /* Get in real time all documents in a collection */
  public getRealTimeAllDocuments<T>(collectionName: string, converter: FirestoreDataConverter<T>): Observable<T[]> {
    const observable = new Observable<T[]>((observer) => {
      const collectionRef = collection(this.db, collectionName).withConverter(converter);
      onSnapshot(
        collectionRef,
        (querySnapshot) => {
          const documents: T[] = [];
          querySnapshot.forEach((item: QueryDocumentSnapshot<T>) => {
            documents.push(item.data());
          });
          observer.next(documents);
        },
        (error) => {
          throw new Error(error.message);
        }
      );
    });
    return observable;
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
    });
    return documents;
  }

  /* Get in real time all documents in a collection that match the constraints */
  public getRealTimeDocumentsByMultipleConstraints<T>(
    collectionName: string,
    constraints: QueryConstraint[],
    converter: FirestoreDataConverter<T>
  ): Observable<T[]> {
    const observable = new Observable<T[]>((observer) => {
      const collectionRef = collection(this.db, collectionName).withConverter(converter);
      const q = query(collectionRef, ...constraints);
      onSnapshot(
        q,
        (querySnapshot) => {
          const documents: T[] = [];
          querySnapshot.forEach((document: QueryDocumentSnapshot<T>) => {
            documents.push(document.data());
          });
          observer.next(documents);
        },
        (error) => {
          throw new Error(error.message);
        }
      );
    });
    return observable;
  }

  /* Get the count of all documents in a collection that match the constraints */
  public async getDocumentsByMultipleConstraintsCount(
    collectionName: string,
    constraints: QueryConstraint[]
  ): Promise<AggregateQuerySnapshot<{ count: AggregateField<number> }>> {
    const collectionRef = collection(this.db, collectionName);
    const q = query(collectionRef, ...constraints);
    const aggregateField = await getCountFromServer(q);
    return aggregateField;
  }
}
