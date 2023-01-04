import { Injectable } from '@angular/core';
import { QueryConstraint, where } from '@angular/fire/firestore';
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

  public async getAssignmentsByEventUidAndEmployeeUid(eventUid: string, employeeUid: string): Promise<Assignment[]> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const employeeUidConstraint: QueryConstraint = where('employeeUid', '==', employeeUid);
    const constraints: QueryConstraint[] = [eventUidConstraint, employeeUidConstraint];
    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );
    return assignments;
  }

  /* ------------------------------------------- ADD ------------------------------------------- */
  public async addAssignment(eventUid: string, employeeUids: string[]): Promise<void> {
    const assignments: Assignment[] = [];
    employeeUids.forEach((employeeUid) => {
      assignments.push({
        uid: '',
        props: {
          eventUid,
          employeeUid,
          active: true,
          personMarked: 0,
          personAssigned: 0
        }
      } as Assignment);
    });
    await this.firebaseCreateService.addDocuments(Collection.ASSIGNMENTS, assignments);
  }

  /* ------------------------------------------- UPDATE ------------------------------------------- */
  public async updateAssignmentPersonAssignedProp(assignmentUid: string, personAssigned: number): Promise<void> {
    const assignment: Assignment = await this.firebaseReadService.getDocumentByUid(
      Collection.ASSIGNMENTS,
      assignmentUid,
      assignmentConverter
    );
    if (assignment) {
      const propsToUpdate = { personAssigned };
      await this.firebaseUpdateService.updateAssignmentProps(assignment, propsToUpdate);
    }
  }

  public async updateAssignmentActiveProp(assignmentUid: string, personMarked: number, active: boolean): Promise<void> {
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
        const propsToUpdate = active ? { active: true } : { personAssigned: personMarked, active: false };
        await this.firebaseUpdateService.updateAssignmentProps(assignment, propsToUpdate);
      }
    }
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteAssignmentRemovedFromList(eventUid: string, employeeUids: string[]): Promise<void> {
    if (!employeeUids || employeeUids.length === 0) return;

    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const employeeUidConstraint: QueryConstraint = where('employeeUid', 'in', employeeUids);
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
