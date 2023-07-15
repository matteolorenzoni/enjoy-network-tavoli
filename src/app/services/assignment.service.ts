import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QueryConstraint, where } from 'firebase/firestore';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
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
    private firebaseUpdateService: FirebaseUpdateService
  ) {}

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getAssignments(): Promise<Assignment[]> {
    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.ASSIGNMENTS,
      [],
      assignmentConverter
    );
    return assignments;
  }

  public async getActiveAssignmentsByEmployeeUid(employeeUid: string): Promise<Assignment[]> {
    const employeeUidConstraint: QueryConstraint = where('employeeUid', '==', employeeUid);
    const isActiveConstraint: QueryConstraint = where('isActive', '==', true);
    const constraints: QueryConstraint[] = [employeeUidConstraint, isActiveConstraint];

    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );
    return assignments;
  }

  public async getAssignmentByEventUidAndEmployeeUid(
    eventUid: string,
    employeeUid: string
  ): Promise<Assignment | undefined> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const employeeUidConstraint: QueryConstraint = where('employeeUid', '==', employeeUid);
    const constraints: QueryConstraint[] = [eventUidConstraint, employeeUidConstraint];

    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );
    return assignments.length > 0 ? assignments[0] : undefined;
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
        personMarkable: 0,
        personMarked: 0
      }
    };
    await this.firebaseCreateService.addDocument(environment.collection.ASSIGNMENTS, assignment);
  }

  /* ------------------------------------------- UPDATE ------------------------------------------- */
  public async updateAssignmentPersonAssignedProp(assignmentUid: string, personMarkable: number): Promise<void> {
    const assignment: Assignment = await this.firebaseReadService.getDocumentByUid(
      environment.collection.ASSIGNMENTS,
      assignmentUid,
      assignmentConverter
    );
    if (assignment) {
      const propsToUpdate = { personMarkable };
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
