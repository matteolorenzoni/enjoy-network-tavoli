import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { documentId, orderBy, QueryConstraint, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { UserCredential } from 'firebase/auth';
import { RoleType } from 'src/app/models/enum';
import { UserService } from './user.service';
import { AssignmentDTO } from '../models/collection';
import { Assignment, Employee } from '../models/type';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase/firebase-crud/firebase-delete.service';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseUpdateService } from './firebase/firebase-crud/firebase-update.service';
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
      environment.collection.EMPLOYEES,
      employeeUid,
      employeeConverter
    );
    return employee;
  }

  public async getEmployeePrAndActiveWithNoAssignment(eventUid: string): Promise<Employee[]> {
    const activeConstraint: QueryConstraint = where('isActive', '==', true);
    const prConstraint: QueryConstraint = where('role', '==', RoleType.PR);
    const constricts: QueryConstraint[] = [activeConstraint, prConstraint];
    const employees: Employee[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.EMPLOYEES,
      constricts,
      employeeConverter
    );

    const employeeUids: string[] = employees.map((employee) => employee.uid);
    const assignmentPromises: Promise<Assignment[]>[] = [];
    for (let i = 0; i < employeeUids.length; i += 10) {
      const employeeUidConstraint: QueryConstraint = where('employeeUid', 'in', employeeUids.slice(i, i + 10));
      const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
      const constraints: QueryConstraint[] = [employeeUidConstraint, eventUidConstraint];

      const promise = this.firebaseReadService.getDocumentsByMultipleConstraints(
        environment.collection.ASSIGNMENTS,
        constraints,
        assignmentConverter
      );
      assignmentPromises.push(promise);
    }

    const assignments: Assignment[][] = await Promise.all(assignmentPromises);
    const assignmentsFlat: Assignment[] = assignments.flat();
    const employeesUidsWithAssignment: string[] = assignmentsFlat.map((assignment) => assignment.props.employeeUid);

    const employeesUidsWithNoAssignment: Employee[] = employees.filter(
      (employee) => !employeesUidsWithAssignment.includes(employee.uid)
    );

    return employeesUidsWithNoAssignment;
  }

  public async getEmployeesByUids(employeeUids: string[]): Promise<Employee[]> {
    if (!employeeUids || employeeUids.length === 0) return [];

    const employeePromises: Promise<Employee[]>[] = [];

    for (let i = 0; i < employeeUids.length; i += 10) {
      const idConstraint: QueryConstraint = where(documentId(), 'in', employeeUids.slice(i, i + 10));
      const constricts: QueryConstraint[] = [idConstraint];
      const promise = this.firebaseReadService.getDocumentsByMultipleConstraints(
        environment.collection.EMPLOYEES,
        constricts,
        employeeConverter
      );
      employeePromises.push(promise);
    }

    const employees: Employee[][] = await Promise.all(employeePromises);

    // order by name and lastName
    return employees.flat().sort((a, b) => a.props.name.localeCompare(b.props.name));
  }

  public async getEmployeesByRole(role: RoleType): Promise<Employee[]> {
    const roleConstraint: QueryConstraint = where('role', '==', role);
    const notNameConstraint: QueryConstraint = where('name', '!=', '---');
    const nameOrderBy: QueryConstraint = orderBy('name', 'asc');
    const lastNameOrderBy: QueryConstraint = orderBy('lastName', 'asc');
    const constraints: QueryConstraint[] = [roleConstraint, notNameConstraint, nameOrderBy, lastNameOrderBy];
    const employees: Employee[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.EMPLOYEES,
      constraints,
      employeeConverter
    );
    return employees;
  }

  public getRealTimeAllEmployees(): Observable<Employee[]> {
    const employees: Observable<Employee[]> = this.firebaseReadService.getRealTimeDocumentsByMultipleConstraints(
      environment.collection.EMPLOYEES,
      [],
      employeeConverter
    );
    return employees;
  }

  /* ------------------------------------------- ADD ------------------------------------------- */
  public async addOrUpdateEmployee(email: string, employee: Employee): Promise<void> {
    if (!employee.uid) {
      /* Add new user */
      const userCredential: UserCredential = await this.userService.register(email, environment.defaultPassword);

      /* Add new employee */
      const newEmployee = { uid: userCredential.user.uid, props: employee.props };
      await this.firebaseCreateService.addDocumentWithUid(environment.collection.EMPLOYEES, newEmployee);
    } else {
      /* Update document */
      await this.firebaseUpdateService.updateDocument(environment.collection.EMPLOYEES, employee);
    }
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteEmployee(uid: string): Promise<void> {
    /* Delete all assignments without person marked and remove person assigned */
    const employeeUidConstraint: QueryConstraint = where('employeeUid', '==', uid);
    const constraints: QueryConstraint[] = [employeeUidConstraint];
    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );
    /* Delete assignments without person marked */
    const assignmentsToDelete: Assignment[] = assignments.filter((item) => item.props.personMarked === 0);
    const assignmentsToDeleteUids: string[] = assignmentsToDelete.map((item) => item.uid);
    await this.firebaseDeleteService.deleteDocumentsByUids(environment.collection.ASSIGNMENTS, assignmentsToDeleteUids);
    /* Reduce person assigned in assignments with person marked */
    const assignmentsToMinimize: Assignment[] = assignments.filter((item) => item.props.personMarked > 0);
    assignmentsToMinimize.forEach(async (assignment) => {
      const propsToUpdate: Partial<AssignmentDTO> = {
        maxPersonMarkable: assignment.props.maxPersonMarkable,
        isActive: false
      };
      await this.firebaseUpdateService.updateDocumentsProps(
        environment.collection.ASSIGNMENTS,
        [assignment],
        propsToUpdate
      );
    });

    /* Delete employee */
    await this.firebaseDeleteService.deleteDocumentByUid(environment.collection.EMPLOYEES, uid);

    /* Delete user */
    // TODO: eliminare anche l'User
  }
}
