import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  IdTokenResult,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserBaseInfo } from '../models/type';

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

  /** Basic infos */
  userBaseInfo: UserBaseInfo | null = null;

  /** User acess token */
  userAccessToken: IdTokenResult | null = null;

  constructor(private auth: Auth, private router: Router) {
    this.userData$ = authState(this.auth);
  }

  public register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  public login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // TODO: da implementare
  public disableUser() {}

  public logout(): Promise<void> {
    this.router.navigate(['/login']);
    this.userBaseInfo = null;
    this.userAccessToken = null;
    return signOut(this.auth);
  }
}
