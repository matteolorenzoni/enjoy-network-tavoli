import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InitializeService {
  private db: Firestore;
  private storage: FirebaseStorage;
  private auth: Auth;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.db = getFirestore(app);
    this.storage = getStorage(app);
    this.auth = getAuth(app);
  }

  /* Getters */
  public getDb(): Firestore {
    return this.db;
  }

  public getStorage(): FirebaseStorage {
    return this.storage;
  }

  public getAuth(): Auth {
    return this.auth;
  }
}
