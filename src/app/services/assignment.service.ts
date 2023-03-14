import { Injectable } from '@angular/core';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase/firebase-crud/firebase-delete.service';
import { FirebaseUpdateService } from './firebase/firebase-crud/firebase-update.service';
import { Assignment } from '../models/type';
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
  public async getAssignmentsByEmployeeUid(employeeUid: string): Promise<Assignment[]> {
    const idConstraint: QueryConstraint = where('employeeUid', '==', employeeUid);
    const constraints: QueryConstraint[] = [idConstraint];

    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );
    return assignments;
  }

  public async getActiveAssignmentsByEmployeeUid(employeeUid: string): Promise<Assignment[]> {
    const idConstraint: QueryConstraint = where('employeeUid', '==', employeeUid);
    const isActiveConstraint: QueryConstraint = where('isActive', '==', true);
    const constraints: QueryConstraint[] = [idConstraint, isActiveConstraint];

    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );
    return assignments;
  }

  public getRealTimeAssignmentsByEventUidAndEmployeeUid(
    eventUid: string,
    employeeUid: string | undefined
  ): Observable<Assignment[]> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const employeeUidConstraint: QueryConstraint = where('employeeUid', '==', employeeUid);
    const constraints: QueryConstraint[] = [eventUidConstraint];
    if (employeeUid) {
      constraints.push(employeeUidConstraint);
    }

    const assignments: Observable<Assignment[]> = this.firebaseReadService.getRealTimeDocumentsByMultipleConstraints(
      environment.collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );
    return assignments;
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
    await this.firebaseCreateService.addDocument(environment.collection.ASSIGNMENTS, assignment);
  }

  /* ------------------------------------------- UPDATE ------------------------------------------- */
  public async updateAssignmentPersonAssignedProp(assignmentUid: string, maxPersonMarkable: number): Promise<void> {
    const assignment: Assignment = await this.firebaseReadService.getDocumentByUid(
      environment.collection.ASSIGNMENTS,
      assignmentUid,
      assignmentConverter
    );
    if (assignment) {
      const propsToUpdate = { maxPersonMarkable };
      await this.firebaseUpdateService.updateDocumentsProps(
        environment.collection.ASSIGNMENTS,
        [assignment],
        propsToUpdate
      );
    }
  }

  public async updateAssignmentIsActive(assignmentUid: string, isActive: boolean): Promise<void> {
    const propsToUpdate = { isActive };
    this.firebaseUpdateService.updateDocumentProps(environment.collection.ASSIGNMENTS, assignmentUid, propsToUpdate);
  }
}
