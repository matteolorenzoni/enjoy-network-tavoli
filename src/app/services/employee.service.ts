import { UserCredential } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { documentId, QueryConstraint, where } from 'firebase/firestore';
import { UserService } from './user.service';
import { AssignmentDTO, Collection, EmployeeDTO } from '../models/collection';
import { Assignment, Employee } from '../models/type';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase/firebase-crud/firebase-delete.service';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseUpdateService } from './firebase/firebase-crud/firebase-update.service';
import { RoleType } from '../models/enum';
import { assignmentConverter, employeeConverter } from '../models/converter';

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
    const employee: Employee = await this.firebaseReadService.getDocumentByUid(
      Collection.EMPLOYEES,
      employeeUid,
      employeeConverter
    );
    return employee;
  }

  public async getAllEmployees(): Promise<Employee[]> {
    const employees: Employee[] = await this.firebaseReadService.getAllDocuments(
      Collection.EMPLOYEES,
      employeeConverter
    );
    return employees;
  }

  public async getEmployeesPrAndActive(): Promise<Employee[]> {
    const activeConstraint: QueryConstraint = where('active', '==', true);
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

    const idConstraint: QueryConstraint = where(documentId(), 'in', employeeUids);
    // TODO: ordinamento
    // const firstOrder: QueryConstraint = orderBy('active');
    // const secondOrder: QueryConstraint = orderBy('personAssigned');
    // const thirdOrder: QueryConstraint = orderBy('personMarked');
    const constricts: QueryConstraint[] = [idConstraint];
    const employees: Employee[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.EMPLOYEES,
      constricts,
      employeeConverter
    );
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
    /* Delete all assigments without person marked and remove person assigned */
    const employeeUidConstraint: QueryConstraint = where('employeeUid', '==', uid);
    const constraints: QueryConstraint[] = [employeeUidConstraint];
    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );
    const assignmentsToDelete: Assignment[] = assignments.filter((item) => item.props.personMarked === 0);
    const assignmentsToDeleteUids: string[] = assignmentsToDelete.map((item) => item.uid);
    await this.firebaseDeleteService.deleteDocumentsByUids(Collection.ASSIGNMENTS, assignmentsToDeleteUids);
    const assignmentsToMinimize: Assignment[] = assignments.filter((item) => item.props.personMarked > 0);
    assignmentsToMinimize.forEach(async (assignment) => {
      const propsToUpdate: Partial<AssignmentDTO> = {
        personAssigned: assignment.props.personMarked,
        active: false
      };
      await this.firebaseUpdateService.updateAssignmentProps(assignment, propsToUpdate);
    });

    /* Delete employee */
    await this.firebaseDeleteService.deleteDocumentByUid(Collection.EMPLOYEES, uid);

    /* Delete user */
    // TODO: eliminare anche l'User
  }
}
