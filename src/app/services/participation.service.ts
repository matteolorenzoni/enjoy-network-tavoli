/* eslint-disable operator-linebreak */
import { Injectable } from '@angular/core';
import { orderBy, QueryConstraint, where } from '@angular/fire/firestore';
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
  public async addParticipation(eventUid: string, tableUid: string, client: Client): Promise<void> {
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

      await this.firebaseCreateService.addDocument(environment.collection.PARTICIPATIONS, participation);
      return;
    }

    /* 2 */
    /* If the participation is not active switch it in active */
    if (participations.every((x) => !x.props.isActive)) {
      /* Make the old participation active */
      const propsToUpdate = { tableUid, isActive: true };
      await this.firebaseUpdateService.updateDocumentsProps(
        environment.collection.PARTICIPATIONS,
        participations,
        propsToUpdate
      );
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

  public async getParticipationByPhone(eventUid: string, phone: string): Promise<Participation> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const phoneConstraint: QueryConstraint = where('phone', '==', phone);
    const constraints: QueryConstraint[] = [eventUidConstraint, phoneConstraint];
    const participations: Participation[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.PARTICIPATIONS,
      constraints,
      participationConverter
    );
    if (participations.length <= 0) {
      throw new Error('Partecipazione non trovata');
    }
    return participations[0];
  }

  public async getParticipationByNameAndLastName(
    eventUid: string,
    name: string,
    lastName: string
  ): Promise<Participation> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const nameConstraint: QueryConstraint = where('name', '==', name);
    const lastNameConstraint: QueryConstraint = where('lastName', '==', lastName);
    const constraints: QueryConstraint[] = [eventUidConstraint, nameConstraint, lastNameConstraint];
    const participations: Participation[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.PARTICIPATIONS,
      constraints,
      participationConverter
    );
    if (participations.length <= 0) {
      throw new Error('Partecipazione non trovata');
    }
    return participations[0];
  }

  public async getParticipationsByEventUid(eventUid: string): Promise<Participation[]> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const isActive: QueryConstraint = where('isActive', '==', true);
    const nameOrderBy = orderBy('name');
    const lastNameOrderBy = orderBy('lastName');
    const constraints = [eventUidConstraint, isActive, nameOrderBy, lastNameOrderBy];
    const participations: Participation[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.PARTICIPATIONS,
      constraints,
      participationConverter
    );
    return participations;
  }

  public async getParticipationsByTableUid(tableUid: string): Promise<Participation[]> {
    const eventUidConstraint: QueryConstraint = where('tableUid', '==', tableUid);
    const isActive: QueryConstraint = where('isActive', '==', true);
    const nameOrderBy = orderBy('name');
    const lastNameOrderBy = orderBy('lastName');
    const constraints = [eventUidConstraint, isActive, nameOrderBy, lastNameOrderBy];
    const participations: Participation[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.PARTICIPATIONS,
      constraints,
      participationConverter
    );
    return participations;
  }

  public getRealTimeParticipationsByTableUid(tableUid: string): Observable<Participation[]> {
    const idConstraint: QueryConstraint = where('tableUid', '==', tableUid);
    const isActiveOrderBy = orderBy('isActive', 'desc');
    const messageIsReceivedOrderBy = orderBy('messageIsReceived');
    const modifiedAtOrderBy = orderBy('modifiedAt');
    const constraints: QueryConstraint[] = [idConstraint, isActiveOrderBy, messageIsReceivedOrderBy, modifiedAtOrderBy];
    const participations: Observable<Participation[]> =
      this.firebaseReadService.getRealTimeDocumentsByMultipleConstraints(
        environment.collection.PARTICIPATIONS,
        constraints,
        participationConverter
      );
    return participations;
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

  public async scanAndGetParticipation(participationUid: string, employeeUid: string): Promise<Participation> {
    const participation: Participation = await this.firebaseReadService.getDocumentByUid(
      environment.collection.PARTICIPATIONS,
      participationUid,
      participationConverter
    );

    if (!participation.props.scannedAt && participation.props.isActive) {
      const propsToUpdate = {
        scannedAt: new Date(),
        scannedFrom: employeeUid
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
}
