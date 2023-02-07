import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * User info from authetication
   *
   * They are persisted, after login they are available even after page refresh or app restart.
   * To delete them, use the signOut method.
   */
  userData$: Observable<User | null>;

  constructor(private auth: Auth, private router: Router) {
    this.userData$ = authState(this.auth);
  }

  public register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  public login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  public logout(): Promise<void> {
    this.router.navigate(['/login']);
    return signOut(this.auth);
  }
}
