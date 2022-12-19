import { Injectable } from '@angular/core';
import { Assignment } from '../models/type';
import { TransformService } from './transform.service';
import { FirebaseReadService } from './firebase-crud/firebase-read.service';
import { FirebaseCreateService } from './firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase-crud/firebase-delete.service';
import { FirebaseUpdateService } from './firebase-crud/firebase-update.service';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  constructor(
    private firebaseCreateService: FirebaseCreateService,
    private firebaseReadService: FirebaseReadService,
    private firebaseUpdateService: FirebaseUpdateService,
    private firebaseDeleteService: FirebaseDeleteService,
    private transformService: TransformService
  ) {}

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getAllAssignments(eventUid: string): Promise<Assignment[]> {
    const querySnapshot = await this.firebaseReadService.getAllAssignments(eventUid);
    const assignments: Assignment[] = this.transformService.qsToAssignments(querySnapshot);
    return assignments;
  }

  /* ------------------------------------------- ADD ------------------------------------------- */

  /* ------------------------------------------- UPDATE ------------------------------------------- */
  public async updateAssignmentPersonAssigned(
    eventUid: string,
    assignmentUid: string,
    personAssigned: number
  ): Promise<void> {
    const propsToUpdate = { personAssigned };
    await this.firebaseUpdateService.updateAssignmentProps(eventUid, assignmentUid, propsToUpdate);
  }

  public async updateAssignmentActive(
    eventUid: string,
    assignmentUid: string,
    personMarked: number,
    active: boolean
  ): Promise<void> {
    /** If the person is not active for the event, are removed as many as person assigned as possible  */
    const propsToUpdate = active ? { active } : { personAssigned: personMarked, active };
    await this.firebaseUpdateService.updateAssignmentProps(eventUid, assignmentUid, propsToUpdate);
  }
}
