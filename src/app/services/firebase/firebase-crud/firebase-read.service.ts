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
  onSnapshot
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { LoaderService } from '../../loader.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseReadService {
  /* Firebase */
  private db!: Firestore;

  constructor(private loaderService: LoaderService) {
    this.db = getFirestore();
  }

  /* Get a single document by its uid */
  public async getDocumentByUid<T>(
    collectionName: string,
    documentUid: string,
    converter: FirestoreDataConverter<T>
  ): Promise<T> {
    this.loaderService.show();

    /* Get the document */
    const collectionRef = collection(this.db, collectionName).withConverter(converter);
    const docRef = doc(collectionRef, documentUid);
    const docSnap = await getDoc(docRef);

    this.loaderService.hide();

    /* If the document does not exist, throw an error */
    if (!docSnap.exists()) throw new Error(`Documento non trovato DEBUG: ${collectionName} - ${documentUid}`);

    /* Return the document */
    return docSnap.data() as T;
  }

  /* Get all documents in a collection */
  public async getAllDocuments<T>(collectionName: string, converter: FirestoreDataConverter<T>): Promise<T[]> {
    this.loaderService.show();

    /* Get the documents */
    const documents: T[] = [];
    const collectionRef = collection(this.db, collectionName).withConverter(converter);
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((item: QueryDocumentSnapshot<T>) => {
      documents.push(item.data());
    });

    this.loaderService.hide();

    return documents;
  }

  /* Get in real time all documents in a collection */
  public getRealTimeAllDocuments<T>(collectionName: string, converter: FirestoreDataConverter<T>): Observable<T[]> {
    this.loaderService.show();

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
          throw new Error(`${error.message} DEBUG: ${collectionName}`);
        }
      );
    });

    this.loaderService.hide();

    return observable;
  }

  /* Get all documents in a collection that match the constraints */
  public async getDocumentsByMultipleConstraints<T>(
    collectionName: string,
    constraints: QueryConstraint[],
    converter: FirestoreDataConverter<T>
  ): Promise<T[]> {
    this.loaderService.show();

    const documents: T[] = [];
    const collectionRef = collection(this.db, collectionName).withConverter(converter);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((item: QueryDocumentSnapshot<T>) => {
      documents.push(item.data());
    });

    this.loaderService.hide();

    return documents;
  }

  /* Get in real time all documents in a collection that match the constraints */
  public getRealTimeDocumentsByMultipleConstraints<T>(
    collectionName: string,
    constraints: QueryConstraint[],
    converter: FirestoreDataConverter<T>
  ): Observable<T[]> {
    this.loaderService.show();

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
          throw new Error(`${error.message} DEBUG: ${collectionName} - ${JSON.stringify(constraints)}`);
        }
      );
    });

    this.loaderService.hide();

    return observable;
  }
}
