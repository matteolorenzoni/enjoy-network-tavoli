import { Injectable } from '@angular/core';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { FirebaseReadService } from './firebase-crud/firebase-read.service';
import { FirebaseCreateService } from './firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase-crud/firebase-delete.service';
import { FirebaseUpdateService } from './firebase-crud/firebase-update.service';
import { Assignment } from '../models/type';

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
    const assignments: Assignment[] = await this.firebaseReadService.getAssignmentsByMultipleConstraints(constraints);
    return assignments;
  }

  /* ------------------------------------------- ADD ------------------------------------------- */
  public async addAssignment(eventUid: string, employeeUids: string[]): Promise<void> {
    const assignments: Assignment[] = [];
    employeeUids.forEach((employeeUid) => {
      assignments.push({
        uid: '',
        assignmentDTO: {
          eventUid,
          employeeUid,
          active: true,
          personMarked: 0,
          personAssigned: 0,
          createdAt: new Date(),
          modificatedAt: new Date()
        }
      } as Assignment);
    });
    await this.firebaseCreateService.addAssignments(assignments);
  }

  /* ------------------------------------------- UPDATE ------------------------------------------- */
  public async updateAssignmentPersonAssignedProp(assignmentUid: string, personAssigned: number): Promise<void> {
    const assignment: Assignment = await this.firebaseReadService.getAssignmentByUid(assignmentUid);
    if (assignment) {
      const propsToUpdate = { personAssigned };
      await this.firebaseUpdateService.updateAssignmentProps(assignment, propsToUpdate);
    }
  }

  public async updateAssignmentActiveProp(assignmentUid: string, personMarked: number, active: boolean): Promise<void> {
    const assignment: Assignment = await this.firebaseReadService.getAssignmentByUid(assignmentUid);
    if (assignment) {
      /** If the person is not active for the event, are removed as many as person assigned as possible  */
      const propsToUpdate = active ? { active } : { personAssigned: personMarked, active };
      await this.firebaseUpdateService.updateAssignmentProps(assignment, propsToUpdate);
    }
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteAssignmentRemovedFromList(eventUid: string, employeeUids: string[]): Promise<void> {
    if (!employeeUids || employeeUids.length === 0) return;

    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const employeeUidsConstraint: QueryConstraint = where('employeeUid', 'in', employeeUids);
    const constraints: QueryConstraint[] = [eventUidConstraint, employeeUidsConstraint];
    const assignments: Assignment[] = await this.firebaseReadService.getAssignmentsByMultipleConstraints(constraints);
    await this.firebaseDeleteService.deleteAssignments(assignments);
  }
}
