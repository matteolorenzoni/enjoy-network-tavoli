import { RoleType } from 'src/app/models/enum';
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { employeeConverter } from '../models/converter';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUid = '';
  userRole: RoleType = RoleType.PR;

  constructor(private auth: Auth, private router: Router, private firebaseReadService: FirebaseReadService) {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          this.userUid = user.uid;
          const employee = await this.firebaseReadService.getDocumentByUid(
            environment.collection.EMPLOYEES,
            user.uid,
            employeeConverter
          );
          this.userRole = employee.props.role;
        } catch (error: any) {
          this.logout();
          throw new Error(error);
        }
      }
    });
  }

  public getUserUid(): string {
    return this.userUid;
  }

  public getUserRole(): RoleType {
    return this.userRole;
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
