import { Injectable } from '@angular/core';
import { doc, getDoc, getDocs, getFirestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { RoleType } from '../models/enum';
import { Employee, Table } from '../models/table';
import { ToastService } from './toast.service';

const ROLE = 'role';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  /** Database */
  private db = getFirestore();

  constructor(private toastService: ToastService) {}

  /* --------- SET -------- */
  public async setEmployee(uid: string): Promise<void> {
    const docRef = doc(this.db, Table.EMPLOYEE, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const employee = docSnap.data() as Employee;
      sessionStorage.setItem('uid', uid);
      Object.keys(employee).forEach((key) => {
        sessionStorage.setItem(key, employee[key as keyof Employee].toString());
      });
    } else {
      this.toastService.showError('Documento non trovato');
    }
  }

  /* --------- GET -------- */
  public async getEmployees(): Promise<Employee[] | null> {
    const collectionRef = collection(this.db, Table.EMPLOYEE);
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.size > 0) {
      return querySnapshot.docs.map((employeeDoc) => employeeDoc.data() as Employee);
    }
    this.toastService.showError('Documento non trovato');
    return null;
  }

  public getEmployeeRole(): RoleType | null {
    return (sessionStorage.getItem(ROLE) as RoleType) || null;
  }
}
