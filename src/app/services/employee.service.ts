import { UserCredential } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { documentId, QueryConstraint, where } from 'firebase/firestore';
import { UserService } from './user.service';
import { EmployeeDTO } from '../models/table';
import { Employee } from '../models/type';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase/firebase-crud/firebase-delete.service';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseUpdateService } from './firebase/firebase-crud/firebase-update.service';
import { RoleType } from '../models/enum';

const PASSWORD_DEFAULT = 'enjoynetwork';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(
    private userService: UserService,
    private firebaseCreateService: FirebaseCreateService,
    private firebaseReadService: FirebaseReadService,
    private firebaseUpdateService: FirebaseUpdateService,
    private firebaseDeleteService: FirebaseDeleteService
  ) {}

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getEmployee(employeeUid: string): Promise<Employee> {
    const employee: Employee = await this.firebaseReadService.getEmployeeByUid(employeeUid);
    return employee;
  }

  public async getAllEmployees(): Promise<Employee[]> {
    const employees: Employee[] = await this.firebaseReadService.getAllEmployees();
    return employees;
  }

  public async getEmployeesPrAndActive(): Promise<Employee[]> {
    const activeConstraint: QueryConstraint = where('active', '==', true);
    const prConstraint: QueryConstraint = where('role', '==', RoleType.PR);
    const constricts: QueryConstraint[] = [activeConstraint, prConstraint];
    const employees: Employee[] = await this.firebaseReadService.getEmployeesByMultipleConstraints(constricts);
    return employees;
  }

  public async getEmployeesByUids(uidArray: string[]): Promise<Employee[]> {
    if (!uidArray || uidArray.length === 0) return [];

    const idConstraint: QueryConstraint = where(documentId(), 'in', uidArray);
    // TODO: ordinamento
    // const firstOrder: QueryConstraint = orderBy('active');
    // const secondOrder: QueryConstraint = orderBy('personAssigned');
    // const thirdOrder: QueryConstraint = orderBy('personMarked');
    const constricts: QueryConstraint[] = [idConstraint];
    const employees: Employee[] = await this.firebaseReadService.getEmployeesByMultipleConstraints(constricts);
    return employees;
  }

  /* ------------------------------------------- ADD ------------------------------------------- */
  public async addOrUpdateEmployee(uid: string | null, employeeDTO: EmployeeDTO, email: string): Promise<void> {
    if (!uid) {
      /* Add new user */
      const userCredential: UserCredential = await this.userService.register(email, PASSWORD_DEFAULT);

      /* Add new employee */
      const employee: Employee = { uid: userCredential.user.uid, employeeDTO };
      await this.firebaseCreateService.addEmployee(employee);
    } else {
      /* Update document */
      const employee: Employee = { uid, employeeDTO };
      await this.firebaseUpdateService.updateEmployee(employee);
    }
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteEmployee(uid: string): Promise<void> {
    await this.firebaseDeleteService.deleteEmployeeByUid(uid);
    // TODO: eliminare anche l'User
  }
}
