import { Injectable } from '@angular/core';
import { doc, getDoc, getDocs, getFirestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Employee, Table } from '../models/table';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  /** Database */
  private db = getFirestore();

  /** Employee */
  private employee!: Employee;
  private employees!: Employee[];

  constructor(private toastService: ToastService) {}

  /* --------- SET -------- */
  public async setEmployee(uid: string): Promise<void> {
    const docRef = doc(this.db, Table.EMPLOYEE, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.employee = docSnap.data() as Employee;
    } else {
      this.toastService.showError('Documento non trovato');
    }
  }

  async setEmployees(): Promise<void> {
    const collectionRef = collection(this.db, Table.EMPLOYEE);
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.size > 0) {
      this.employees = querySnapshot.docs.map((employeeDoc) => employeeDoc.data() as Employee);
    } else {
      this.toastService.showError('Documento non trovato');
    }
  }

  /* --------- GET -------- */
  public getEmployee(): Employee {
    return this.employee;
  }

  public getEmployees(): Employee[] {
    return this.employees;
  }
}
