import { Injectable } from '@angular/core';
import { Firestore, doc, deleteDoc, getFirestore, collection, writeBatch } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDeleteService {
  /* Firebase */
  private db!: Firestore;

  constructor() {
    this.db = getFirestore();
  }

  public async deleteDocumentByUid(collectionName: string, documentUid: string): Promise<void> {
    const collectionRef = collection(this.db, collectionName);
    const docRef = doc(collectionRef, documentUid);
    await deleteDoc(docRef);
    if (!environment.production) console.info('Documento eliminato:', documentUid);
  }

  public async deleteDocumentsByUids(collectionName: string, documentUids: string[]): Promise<void> {
    const batch = writeBatch(this.db);
    const collectionRef = collection(this.db, collectionName);
    documentUids.forEach((documentUid: string) => {
      const docRef = doc(collectionRef, documentUid);
      batch.delete(docRef);
    });
    await batch.commit();
    if (!environment.production) console.info('Documenti eliminati:', documentUids);
  }
}
