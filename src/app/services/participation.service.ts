import { Injectable } from '@angular/core';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { Assignment, Participation } from '../models/type';
import { assignmentConverter, participationConverter } from '../models/converter';
import { Collection } from '../models/collection';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase/firebase-crud/firebase-delete.service';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseUpdateService } from './firebase/firebase-crud/firebase-update.service';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  constructor(
    private firebaseCreateService: FirebaseCreateService,
    private firebaseReadService: FirebaseReadService,
    private firebaseUpdateService: FirebaseUpdateService,
    private firebaseDeleteService: FirebaseDeleteService
  ) {}

  /* ------------------------------------------- CREATE ------------------------------------------- */
  public async addParticipation(
    eventUid: string,
    employeeUid: string,
    tableUid: string,
    clientUid: string
  ): Promise<void> {
    /* Increase the number of marked people */
    const okOperation = await this.updateAssignmentMarkedPerson(eventUid, employeeUid, -1);

    /* Add participation */
    if (okOperation) {
      const participation: Participation = {
        uid: '',
        props: {
          tableUid,
          clientUid,
          isActive: true,
          isScanned: false
        }
      };
      await this.firebaseCreateService.addDocument(Collection.PARTICIPATIONS, participation);
    }
  }

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getParticipationsByTableUid(tableUid: string): Promise<Participation[]> {
    const idConstraint: QueryConstraint = where('tableUid', '==', tableUid);
    const isActiveConstraint = where('isActive', '==', true);
    const constraints: QueryConstraint[] = [idConstraint, isActiveConstraint];
    const participations: Participation[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.PARTICIPATIONS,
      constraints,
      participationConverter
    );
    return participations;
  }

  public async getParticipationsCountByTableUid(tableUid: string): Promise<number> {
    const tableUidConstraint = where('tableUid', '==', tableUid);
    const isActiveConstraint = where('isActive', '==', true);
    const constricts: QueryConstraint[] = [tableUidConstraint, isActiveConstraint];
    const aggregate = await this.firebaseReadService.getDocumentsByMultipleConstraintsCount(
      Collection.PARTICIPATIONS,
      constricts
    );
    return aggregate.data().count;
  }

  public async getParticipationsCountByMultiTableUid(tableUids: string[]): Promise<number> {
    if (!tableUids || tableUids.length === 0) return 0;

    const idConstraint: QueryConstraint = where('tableUid', 'in', tableUids);
    const isActiveConstraint = where('isActive', '==', true);
    const constraints: QueryConstraint[] = [idConstraint, isActiveConstraint];
    const aggregate = await this.firebaseReadService.getDocumentsByMultipleConstraintsCount(
      Collection.PARTICIPATIONS,
      constraints
    );
    return aggregate.data().count;
  }

  /* ------------------------------------------- UPDATE ------------------------------------------- */
  public async madeParticipationNotActive(
    eventUid: string,
    employeeUid: string,
    participationUid: string
  ): Promise<void> {
    /* Decrease the number of marked people */
    const okOperation = await this.updateAssignmentMarkedPerson(eventUid, employeeUid, -1);

    /* If the operation was successful, update the participation */
    if (okOperation) {
      const participation: Participation = await this.firebaseReadService.getDocumentByUid(
        Collection.PARTICIPATIONS,
        participationUid,
        participationConverter
      );
      const propsToUpdate = {
        isActive: false
      };
      await this.firebaseUpdateService.updateDocumentProps(Collection.PARTICIPATIONS, participation, propsToUpdate);
    }
  }

  public async updateAssignmentMarkedPerson(eventUid: string, employeeUid: string, value: 1 | -1): Promise<boolean> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const employeeUidConstraint: QueryConstraint = where('employeeUid', '==', employeeUid);
    const constraints: QueryConstraint[] = [eventUidConstraint, employeeUidConstraint];
    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );

    /* If there is no assignment, return false */
    if (assignments.length <= 0) {
      return false;
    }

    const assignment: Assignment = assignments[0];
    const propsToUpdate = { personMarked: assignment.props.personMarked + value };
    await this.firebaseUpdateService.updateDocumentProps(Collection.ASSIGNMENTS, assignment, propsToUpdate);
    return true;
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteParticipation(tableUid: string, clientUid: string): Promise<void> {
    const tableUidConstraint: QueryConstraint = where('tableUid', '==', tableUid);
    const clientUidConstraint: QueryConstraint = where('clientUid', '==', clientUid);
    const constraints: QueryConstraint[] = [tableUidConstraint, clientUidConstraint];
    const participations: Participation[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.PARTICIPATIONS,
      constraints,
      participationConverter
    );
    const participationsUids: string[] = participations.map((participation) => participation.uid);
    await this.firebaseDeleteService.deleteDocumentsByUids(Collection.PARTICIPATIONS, participationsUids);
  }
}
