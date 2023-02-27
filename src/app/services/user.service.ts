import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
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
  constructor(private auth: Auth, private router: Router, private firebaseReadService: FirebaseReadService) {}

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

  public async getCurrentUserRole(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          const role = this.getRole(user);
          resolve(role);
        }
        reject();
      }, reject);
    });
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
