import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RoleType } from 'src/app/models/enum';
import { InitializeService } from './firebase/initialize.service';
import { Employee } from '../models/type';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { employeeConverter } from '../models/converter';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private auth: Auth;
  private userSubject = new BehaviorSubject<User | undefined>(undefined);

  constructor(
    private router: Router,
    private initializeService: InitializeService,
    private firebaseReadService: FirebaseReadService
  ) {
    this.auth = this.initializeService.getAuth();
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user || undefined);
    });
  }

  /* ------------------------------------------- GET ------------------------------------------- */
  public getUserSubject(): Observable<User | undefined> {
    return this.userSubject.asObservable();
  }

  public getUserUid(): string {
    return this.userSubject.value?.uid || '';
  }

  public async getUserRole(): Promise<RoleType> {
    const employee: Employee = await this.firebaseReadService.getDocumentByUid(
      environment.collection.EMPLOYEES,
      this.getUserUid(),
      employeeConverter
    );
    return employee.props.role;
  }

  /* ------------------------------------------- HTTP Methods ------------------------------------------- */
  public async register(email: string, password: string): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    return userCredential;
  }

  public async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    return userCredential;
  }

  public async logout(): Promise<void> {
    this.router.navigate(['/login']);
    await signOut(this.auth);
  }
}
