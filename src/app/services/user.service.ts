import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { InitializeService } from './firebase/initialize.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User | undefined>(undefined);

  constructor(private router: Router, private initializeService: InitializeService) {
    onAuthStateChanged(this.initializeService.getAuth(), (user) => {
      this.userSubject.next(user || undefined);
    });
  }

  /* ------------------------------------------- GET ------------------------------------------- */
  public getUserSubject(): Observable<User | undefined> {
    return this.userSubject.asObservable();
  }

  public getUserUid(): string {
    const user = this.userSubject.value;
    if (!user) {
      this.logout();
      throw new Error('Utente non trovato');
    }
    return user.uid;
  }

  /* ------------------------------------------- HTTP Methods ------------------------------------------- */
  public register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.initializeService.getAuth(), email, password);
  }

  public login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.initializeService.getAuth(), email, password);
  }

  public logout(): Promise<void> {
    this.router.navigate(['/login']);
    return signOut(this.initializeService.getAuth());
  }
}
