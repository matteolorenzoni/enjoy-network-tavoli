/* eslint-disable operator-linebreak */
import { Injectable } from '@angular/core';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Assignment, Participation, SMS } from '../models/type';
import { assignmentConverter, participationConverter } from '../models/converter';
import { Collection } from '../models/collection';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase/firebase-crud/firebase-delete.service';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseUpdateService } from './firebase/firebase-crud/firebase-update.service';
import { SmsHostingService } from './sms-hosting.service';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  constructor(
    private firebaseCreateService: FirebaseCreateService,
    private firebaseReadService: FirebaseReadService,
    private firebaseUpdateService: FirebaseUpdateService,
    private firebaseDeleteService: FirebaseDeleteService,
    private smsHostingService: SmsHostingService
  ) {}

  /* ------------------------------------------- CREATE ------------------------------------------- */
  public async addOrUpdateParticipation(
    eventUid: string,
    employeeUid: string,
    tableUid: string,
    clientUid: string,
    eventMessage: string
  ): Promise<void> {
    /* Check if the client has already a participation */
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const clientUidConstraint: QueryConstraint = where('clientUid', '==', clientUid);
    const constraints: QueryConstraint[] = [eventUidConstraint, clientUidConstraint];
    const participations: Participation[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.PARTICIPATIONS,
      constraints,
      participationConverter
    );

    /* 1) If the client hasn't an active or not-active participation, create a new one */
    if (participations.length <= 0) {
      /* Increase the number of marked people if it is possible */
      await this.updateAssignmentMarkedPerson(eventUid, employeeUid, 1);

      /* Add participation */
      const participation: Participation = {
        uid: '',
        props: {
          eventUid,
          tableUid,
          clientUid,
          isActive: true,
          isScanned: false,
          messageIsReceived: false
        }
      };
      await this.firebaseCreateService.addDocument(Collection.PARTICIPATIONS, participation);

      /* Send sms */
      const sms: SMS = {
        to: '393389108738',
        text: eventMessage,
        sandbox: false
      };
      this.smsHostingService.sendSms(sms).subscribe({
        next: (data) => console.log(data),
        error: (error: Error) => {
          throw new Error(error.message);
        }
      });
      return;
    }

    /* 2) If the participation is not active switch it in active */
    if (participations[0] && !participations[0].props.isActive) {
      /* Increase the number of marked people if it is possible */
      await this.updateAssignmentMarkedPerson(eventUid, employeeUid, 1);

      /* Make the old participation active */
      const propsToUpdate = { isActive: true };
      await this.firebaseUpdateService.updateDocumentProps(Collection.PARTICIPATIONS, participations[0], propsToUpdate);
      return;
    }

    /* 3) If the participation is active throw an error */
    throw new Error("Il cliente è già segnato all'interno di un'altro tavolo per questo evento");
  }

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getParticipationByUid(participationUid: string): Promise<Participation> {
    const participation = await this.firebaseReadService.getDocumentByUid(
      Collection.PARTICIPATIONS,
      participationUid,
      participationConverter
    );
    return participation;
  }

  public async getParticipationByTableUidAndClientUid(
    tableUid: string,
    clientUid: string
  ): Promise<Participation | undefined> {
    const tableUidConstraint: QueryConstraint = where('tableUid', '==', tableUid);
    const clientUidConstraint: QueryConstraint = where('clientUid', '==', clientUid);
    const constraints: QueryConstraint[] = [tableUidConstraint, clientUidConstraint];
    const participations: Participation[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.PARTICIPATIONS,
      constraints,
      participationConverter
    );
    return participations[0] || undefined;
  }

  public getRealTimeParticipationsByTableUid(tableUid: string): Observable<Participation[]> {
    const idConstraint: QueryConstraint = where('tableUid', '==', tableUid);
    const isActiveConstraint = where('isActive', '==', true);
    const constraints: QueryConstraint[] = [idConstraint, isActiveConstraint];
    const participations: Observable<Participation[]> =
      this.firebaseReadService.getRealTimeDocumentsByMultipleConstraints(
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
    await this.updateAssignmentMarkedPerson(eventUid, employeeUid, -1);

    /* If the operation was successful, update the participation */
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

  public async updateAssignmentMarkedPerson(eventUid: string, employeeUid: string, value: 1 | -1) {
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
      throw new Error('Si è verificato un errore, contatta uno staffer');
    }

    const assignment: Assignment = assignments[0];

    if (assignment.props.personMarked + value > assignment.props.maxPersonMarkable) {
      throw new Error('Hai raggiunto il limite massimo per questo evento, contatta uno staffer');
    }

    const propsToUpdate = { personMarked: assignment.props.personMarked + value };
    await this.firebaseUpdateService.updateDocumentProps(Collection.ASSIGNMENTS, assignment, propsToUpdate);
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
