/* eslint-disable operator-linebreak */
import { Injectable } from '@angular/core';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Assignment, Client, Participation } from '../models/type';
import { assignmentConverter, participationConverter } from '../models/converter';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase/firebase-crud/firebase-delete.service';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseUpdateService } from './firebase/firebase-crud/firebase-update.service';
import { SessionStorageService } from './sessionstorage.service';
import { RoleType } from '../models/enum';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  constructor(
    private firebaseCreateService: FirebaseCreateService,
    private firebaseReadService: FirebaseReadService,
    private firebaseUpdateService: FirebaseUpdateService,
    private firebaseDeleteService: FirebaseDeleteService,
    private sessionStorageService: SessionStorageService
  ) {}

  /* ------------------------------------------- CREATE ------------------------------------------- */
  public async addParticipation(
    eventUid: string,
    employeeUid: string,
    tableUid: string,
    client: Client
  ): Promise<void> {
    /* Check if the client has already a participation */
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const phoneConstraint: QueryConstraint = where('phone', '==', client.props.phone);
    const constraints: QueryConstraint[] = [eventUidConstraint, phoneConstraint];
    const participations: Participation[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.PARTICIPATIONS,
      constraints,
      participationConverter
    );

    /* 1 */
    /* If the client has 0 participations, create a new one */
    if (participations.length <= 0) {
      /* Increase the number of marked people if it is possible */
      const updateAssignmentPromise = this.updateAssignmentMarkedPerson(eventUid, employeeUid, 1);

      /* Add participation */
      const participation: Participation = {
        uid: '',
        props: {
          eventUid,
          tableUid,
          name: client.props.name,
          lastName: client.props.lastName,
          phone: client.props.phone,
          isActive: true,
          messageIsReceived: false
        }
      };
      const addParticipationPromise = this.firebaseCreateService.addDocument(
        environment.collection.PARTICIPATIONS,
        participation
      );

      const promises = [updateAssignmentPromise, addParticipationPromise];
      await Promise.all(promises);
      return;
    }

    /* 2 */
    /* If the participation is not active switch it in active */
    if (participations.every((x) => !x.props.isActive)) {
      /* Increase the number of marked people if it is possible */
      const updateAssignmentPromise = await this.updateAssignmentMarkedPerson(eventUid, employeeUid, 1);

      /* Make the old participation active */
      const propsToUpdate = { tableUid, isActive: true };
      const updateParticipationPromise = await this.firebaseUpdateService.updateDocumentsProps(
        environment.collection.PARTICIPATIONS,
        participations,
        propsToUpdate
      );

      const promises = [updateAssignmentPromise, updateParticipationPromise];
      await Promise.all(promises);
      return;
    }

    /* 3 */
    /* If the participation is active throw an error */
    throw new Error("Il cliente è già segnato all'interno di un'altro tavolo per questo evento");
  }

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getParticipationByUid(participationUid: string): Promise<Participation> {
    const participation = await this.firebaseReadService.getDocumentByUid(
      environment.collection.PARTICIPATIONS,
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
      environment.collection.PARTICIPATIONS,
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
        environment.collection.PARTICIPATIONS,
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
      environment.collection.PARTICIPATIONS,
      constricts
    );
    return aggregate.data().count;
  }

  public async getParticipationsCountByMultiTableUid(tableUids: string[]): Promise<number> {
    if (!tableUids || tableUids.length === 0) return 0;

    const countPromises = [];

    for (let i = 0; i < tableUids.length; i += 10) {
      const idConstraint: QueryConstraint = where('tableUid', 'in', tableUids.slice(i, i + 10));
      const isActiveConstraint = where('isActive', '==', true);
      const constraints: QueryConstraint[] = [idConstraint, isActiveConstraint];
      const promise = this.firebaseReadService.getDocumentsByMultipleConstraintsCount(
        environment.collection.PARTICIPATIONS,
        constraints
      );
      countPromises.push(promise);
    }

    const countSnapshots = await Promise.all(countPromises);
    const count = countSnapshots.reduce((acc, curr) => acc + curr.data().count, 0);
    return count;
  }

  /* ------------------------------------------- UPDATE ------------------------------------------- */
  public async updateParticipationNotActive(
    eventUid: string,
    employeeUid: string,
    participationUid: string
  ): Promise<void> {
    /* Decrease the number of marked people */
    await this.updateAssignmentMarkedPerson(eventUid, employeeUid, -1);

    /* If the operation was successful, update the participation */
    const participation: Participation = await this.firebaseReadService.getDocumentByUid(
      environment.collection.PARTICIPATIONS,
      participationUid,
      participationConverter
    );
    const propsToUpdate = {
      isActive: false
    };
    await this.firebaseUpdateService.updateDocumentsProps(
      environment.collection.PARTICIPATIONS,
      [participation],
      propsToUpdate
    );
  }

  public async updateAssignmentMarkedPerson(eventUid: string, employeeUid: string, value: 1 | -1) {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const employeeUidConstraint: QueryConstraint = where('employeeUid', '==', employeeUid);
    const constraints: QueryConstraint[] = [eventUidConstraint, employeeUidConstraint];
    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );

    /* If there is no assignment, return false */
    const employeeRole = this.sessionStorageService.getEmployeeRole();
    if (assignments.length <= 0) {
      if (employeeRole === RoleType.ADMINISTRATOR) return;
      throw new Error('Si è verificato un errore, contatta uno staffer');
    }

    const assignment: Assignment = assignments[0];

    if (assignment.props.personMarked + value > assignment.props.maxPersonMarkable) {
      throw new Error('Hai raggiunto il limite massimo per questo evento, contatta uno staffer');
    }

    const propsToUpdate = { personMarked: assignment.props.personMarked + value };
    await this.firebaseUpdateService.updateDocumentsProps(
      environment.collection.ASSIGNMENTS,
      [assignment],
      propsToUpdate
    );
  }

  public async scanAndGetParticipation(participationUid: string): Promise<Participation> {
    const participation: Participation = await this.firebaseReadService.getDocumentByUid(
      environment.collection.PARTICIPATIONS,
      participationUid,
      participationConverter
    );

    if (!participation.props.scannedAt && participation.props.isActive) {
      const propsToUpdate = {
        scannedAt: new Date()
      };
      await this.firebaseUpdateService.updateDocumentsProps(
        environment.collection.PARTICIPATIONS,
        [participation],
        propsToUpdate
      );
      participation.props.scannedAt = propsToUpdate.scannedAt;
    }

    return participation;
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteParticipation(tableUid: string, clientUid: string): Promise<void> {
    const tableUidConstraint: QueryConstraint = where('tableUid', '==', tableUid);
    const clientUidConstraint: QueryConstraint = where('clientUid', '==', clientUid);
    const constraints: QueryConstraint[] = [tableUidConstraint, clientUidConstraint];
    const participations: Participation[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.PARTICIPATIONS,
      constraints,
      participationConverter
    );
    const participationsUids: string[] = participations.map((participation) => participation.uid);
    await this.firebaseDeleteService.deleteDocumentsByUids(environment.collection.PARTICIPATIONS, participationsUids);
  }
}
