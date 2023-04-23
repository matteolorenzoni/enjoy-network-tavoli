import { Injectable } from '@angular/core';
import { Firestore, doc, deleteDoc, getFirestore, collection, writeBatch } from '@angular/fire/firestore';
import { LoaderService } from '../../loader.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDeleteService {
  /* Firebase */
  private db!: Firestore;

  constructor(private loaderService: LoaderService) {
    this.db = getFirestore();
  }

  public async deleteDocumentByUid(collectionName: string, documentUid: string): Promise<void> {
    this.loaderService.show();

    const collectionRef = collection(this.db, collectionName);
    const docRef = doc(collectionRef, documentUid);
    await deleteDoc(docRef);

    this.loaderService.hide();
  }

  public async deleteDocumentsByUids(collectionName: string, documentUids: string[]): Promise<void> {
    this.loaderService.show();

    const batch = writeBatch(this.db);
    const collectionRef = collection(this.db, collectionName);
    documentUids.forEach((documentUid: string) => {
      const docRef = doc(collectionRef, documentUid);
      batch.delete(docRef);
    });
    await batch.commit();

    this.loaderService.hide();
  }
}
