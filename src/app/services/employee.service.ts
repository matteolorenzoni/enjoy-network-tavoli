import { UserCredential } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { doc, getDoc, getDocs, getFirestore } from '@angular/fire/firestore';
import { collection, setDoc } from 'firebase/firestore';
import { UserService } from './user.service';
import { RoleType } from '../models/enum';
import { EmployeeDTO, Table } from '../models/table';
import { ToastService } from './toast.service';

const PASSWORD_DEFAULT = 'enjoynetwork';
const ROLE = 'role';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  /** Database */
  private db = getFirestore();

  constructor(private toastService: ToastService, private userService: UserService) {}

  /* --------- SET -------- */
  public async setEmployeePropsInLocalStorage(uid: string): Promise<void> {
    const docRef = doc(this.db, Table.EMPLOYEES, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const employee = docSnap.data() as EmployeeDTO;
      sessionStorage.setItem('uid', uid);
      Object.keys(employee).forEach((key) => {
        sessionStorage.setItem(key, employee[key as keyof EmployeeDTO].toString());
      });
    } else {
      this.toastService.showError('Documento non trovato');
    }
  }

  public async addOrUpdateEmployee(email: string, employee: EmployeeDTO, uid: string | null): Promise<void> {
    if (!uid) {
      /* Create new user */
      const userCredential: UserCredential = await this.userService.register(email, PASSWORD_DEFAULT);
      const userCredentialUid = userCredential.user?.uid;
      if (userCredentialUid) {
        /* Add document */
        await setDoc(doc(this.db, Table.EMPLOYEES, userCredentialUid), employee);
      }
    } else {
      /* Update document */
      const newEmployee: EmployeeDTO = employee;
      newEmployee.modificatedAt = new Date();
      await setDoc(doc(this.db, Table.EMPLOYEES, uid), newEmployee);
    }
  }

  /* --------- GET -------- */
  public async getEmployees(): Promise<EmployeeDTO[]> {
    const collectionRef = collection(this.db, Table.EMPLOYEES);
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.size > 0) {
      return querySnapshot.docs.map((employeeDoc) => employeeDoc.data() as EmployeeDTO);
    }
    this.toastService.showError('Documento non trovato');
    return [];
  }

  public getEmployeeRole(): RoleType | null {
    return (sessionStorage.getItem(ROLE) as RoleType) || null;
  }
}
