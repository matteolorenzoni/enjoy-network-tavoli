import { RoleType } from 'src/app/models/enum';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { employeeConverter } from '../models/converter';
import { InitializeService } from './firebase/initialize.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUid = '';
  userRole: RoleType = RoleType.PR;

  constructor(
    private router: Router,
    private initializeService: InitializeService,
    private firebaseReadService: FirebaseReadService
  ) {
    onAuthStateChanged(this.initializeService.getAuth(), (user) => {
      if (user) {
        this.userUid = user.uid;
      }
    });
  }

  public async getRole(user: User): Promise<string> {
    try {
      const { uid } = user;
      const employee = await this.firebaseReadService.getDocumentByUid(
        environment.collection.EMPLOYEES,
        uid,
        employeeConverter
      );
      return employee.props.role;
    } catch (error) {
      return '';
    }
  }

  // TODO: eliminarla
  public async getCurrentUserRole(): Promise<string> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(
        this.initializeService.getAuth(),
        (user) => {
          if (user) {
            const role = this.getRole(user);
            resolve(role);
          }
          reject();
        },
        reject
      );
    });
  }

  public getUserUid(): string {
    return this.userUid;
  }

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
