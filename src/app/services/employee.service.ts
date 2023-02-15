import { environment } from 'src/environments/environment';
import { UserCredential } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { documentId, QueryConstraint, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { AssignmentDTO, Collection } from '../models/collection';
import { Assignment, Employee } from '../models/type';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase/firebase-crud/firebase-delete.service';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseUpdateService } from './firebase/firebase-crud/firebase-update.service';
import { RoleType } from '../models/enum';
import { assignmentConverter, employeeConverter } from '../models/converter';

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
    const employee: Employee = await this.firebaseReadService.getDocumentByUid(
      Collection.EMPLOYEES,
      employeeUid,
      employeeConverter
    );
    return employee;
  }

  public getRealTimeAllEmployees(): Observable<Employee[]> {
    const employees: Observable<Employee[]> = this.firebaseReadService.getRealTimeAllDocuments(
      Collection.EMPLOYEES,
      employeeConverter
    );
    return employees;
  }

  public async getEmployeesPrAndActive(): Promise<Employee[]> {
    const activeConstraint: QueryConstraint = where('isActive', '==', true);
    const prConstraint: QueryConstraint = where('role', '==', RoleType.PR);
    const constricts: QueryConstraint[] = [activeConstraint, prConstraint];
    const employees: Employee[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.EMPLOYEES,
      constricts,
      employeeConverter
    );
    return employees;
  }

  public async getEmployeesByUids(employeeUids: string[]): Promise<Employee[]> {
    if (!employeeUids || employeeUids.length === 0) return [];

    const employeePromises: Promise<Employee[]>[] = [];

    for (let i = 0; i < employeeUids.length; i += 10) {
      const idConstraint: QueryConstraint = where(documentId(), 'in', employeeUids.slice(i, i + 10));
      const constricts: QueryConstraint[] = [idConstraint];
      const promise = this.firebaseReadService.getDocumentsByMultipleConstraints(
        Collection.EMPLOYEES,
        constricts,
        employeeConverter
      );
      employeePromises.push(promise);
    }

    const employees: Employee[][] = await Promise.all(employeePromises);

    return employees.flat();
  }

  /* ------------------------------------------- ADD ------------------------------------------- */
  public async addOrUpdateEmployee(email: string, employee: Employee): Promise<void> {
    if (!employee.uid) {
      /* Add new user */
      const userCredential: UserCredential = await this.userService.register(email, environment.defaultPassword);

      /* Add new employee */
      const newEmployee = { uid: userCredential.user.uid, props: employee.props };
      await this.firebaseCreateService.addDocumentWithUid(Collection.EMPLOYEES, newEmployee);
    } else {
      /* Update document */
      await this.firebaseUpdateService.updateDocument(Collection.EMPLOYEES, employee);
    }
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteEmployee(uid: string): Promise<void> {
    /* Delete all assignments without person marked and remove person assigned */
    const employeeUidConstraint: QueryConstraint = where('employeeUid', '==', uid);
    const constraints: QueryConstraint[] = [employeeUidConstraint];
    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );
    /* Delete assignments without person marked */
    const assignmentsToDelete: Assignment[] = assignments.filter((item) => item.props.personMarked === 0);
    const assignmentsToDeleteUids: string[] = assignmentsToDelete.map((item) => item.uid);
    await this.firebaseDeleteService.deleteDocumentsByUids(Collection.ASSIGNMENTS, assignmentsToDeleteUids);
    /* Reduce person assigned in assignments with person marked */
    const assignmentsToMinimize: Assignment[] = assignments.filter((item) => item.props.personMarked > 0);
    assignmentsToMinimize.forEach(async (assignment) => {
      const propsToUpdate: Partial<AssignmentDTO> = {
        maxPersonMarkable: assignment.props.maxPersonMarkable,
        isActive: false
      };
      await this.firebaseUpdateService.updateDocumentProps(Collection.ASSIGNMENTS, assignment, propsToUpdate);
    });

    /* Delete employee */
    await this.firebaseDeleteService.deleteDocumentByUid(Collection.EMPLOYEES, uid);

    /* Delete user */
    // TODO: eliminare anche l'User
  }
}
