import { Injectable } from '@angular/core';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase/firebase-crud/firebase-delete.service';
import { FirebaseUpdateService } from './firebase/firebase-crud/firebase-update.service';
import { Assignment } from '../models/type';
import { Collection } from '../models/collection';
import { assignmentConverter } from '../models/converter';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  constructor(
    private firebaseCreateService: FirebaseCreateService,
    private firebaseReadService: FirebaseReadService,
    private firebaseUpdateService: FirebaseUpdateService,
    private firebaseDeleteService: FirebaseDeleteService
  ) {}

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getAssignmentsByEventUid(eventUid: string): Promise<Assignment[]> {
    const idConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const constraints: QueryConstraint[] = [idConstraint];
    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );
    return assignments;
  }

  public getRealTimeAssignmentsByEventUid(eventUid: string): Observable<Assignment[]> {
    const idConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const constraints: QueryConstraint[] = [idConstraint];
    const assignments: Observable<Assignment[]> = this.firebaseReadService.getRealTimeDocumentsByMultipleConstraints(
      Collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );
    return assignments;
  }

  public async getAssignmentsByEmployeeUid(employeeUid: string): Promise<Assignment[]> {
    const idConstraint: QueryConstraint = where('employeeUid', '==', employeeUid);
    const constraints: QueryConstraint[] = [idConstraint];
    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );
    return assignments;
  }

  public async getAssignmentByEventUidAndEmployeeUid(
    eventUid: string,
    employeeUid: string
  ): Promise<Assignment | null> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const employeeUidConstraint: QueryConstraint = where('employeeUid', '==', employeeUid);
    const constraints: QueryConstraint[] = [eventUidConstraint, employeeUidConstraint];
    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );
    return assignments && assignments.length > 0 ? assignments[0] : null;
  }

  /* ------------------------------------------- ADD ------------------------------------------- */
  public async addAssignment(eventUid: string, employeeUid: string): Promise<void> {
    const assignment: Assignment = {
      uid: '',
      props: {
        eventUid,
        employeeUid,
        isActive: true,
        personMarked: 0,
        maxPersonMarkable: 0
      }
    };
    await this.firebaseCreateService.addDocument(Collection.ASSIGNMENTS, assignment);
  }

  /* ------------------------------------------- UPDATE ------------------------------------------- */
  public async updateAssignmentPersonAssignedProp(assignmentUid: string, maxPersonMarkable: number): Promise<void> {
    const assignment: Assignment = await this.firebaseReadService.getDocumentByUid(
      Collection.ASSIGNMENTS,
      assignmentUid,
      assignmentConverter
    );
    if (assignment) {
      const propsToUpdate = { maxPersonMarkable };
      await this.firebaseUpdateService.updateDocumentProps(Collection.ASSIGNMENTS, assignment, propsToUpdate);
    }
  }

  public async updateAssignmentIsActive(assignmentUid: string, personMarked: number, isActive: boolean): Promise<void> {
    const assignment: Assignment = await this.firebaseReadService.getDocumentByUid(
      Collection.ASSIGNMENTS,
      assignmentUid,
      assignmentConverter
    );
    if (assignment) {
      if (personMarked === 0) {
        this.firebaseDeleteService.deleteDocumentByUid(Collection.ASSIGNMENTS, assignmentUid);
      } else {
        /** If the person is not active for the event, are removed as many as person assigned as possible  */
        const propsToUpdate = isActive ? { isActive: true } : { maxPersonMarkable: personMarked, isActive: false };
        await this.firebaseUpdateService.updateDocumentProps(Collection.ASSIGNMENTS, assignment, propsToUpdate);
      }
    }
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteAssignment(eventUid: string, employeeUid: string): Promise<void> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const employeeUidConstraint: QueryConstraint = where('employeeUid', '==', employeeUid);
    const constraints: QueryConstraint[] = [eventUidConstraint, employeeUidConstraint];
    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );
    const assignmentsUids: string[] = assignments.map((assignment) => assignment.uid);
    await this.firebaseDeleteService.deleteDocumentsByUids(Collection.ASSIGNMENTS, assignmentsUids);
  }
}
