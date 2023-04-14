/* eslint-disable operator-linebreak */
import { Injectable } from '@angular/core';
import { orderBy, QueryConstraint, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SMSStatusType, ParticipationType } from '../models/enum';
import { Client, Participation } from '../models/type';
import { participationConverter } from '../models/converter';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseUpdateService } from './firebase/firebase-crud/firebase-update.service';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  constructor(
    private firebaseCreateService: FirebaseCreateService,
    private firebaseReadService: FirebaseReadService,
    private firebaseUpdateService: FirebaseUpdateService
  ) {}

  /* ------------------------------------------- CREATE ------------------------------------------- */
  public async addParticipation(
    eventUid: string,
    tableUid: string,
    client: Client,
    isForFidelity: boolean
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
      const participation: Participation = {
        uid: '',
        props: {
          eventUid,
          type: isForFidelity ? ParticipationType.FIDELITY : ParticipationType.TABLE,
          tableUid,
          name: client.props.name,
          lastName: client.props.lastName,
          phone: client.props.phone,
          isScanned: false,
          isActive: true,
          messageIsReceived: false,
          statusSMS: SMSStatusType.NOTDELIVERED
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

  public async getParticipationsNotScannedByEventUid(eventUid: string): Promise<Participation[]> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const isScanned: QueryConstraint = where('isScanned', '==', false);
    const isActive: QueryConstraint = where('isActive', '==', true);
    const constraints = [eventUidConstraint, isScanned, isActive];
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

  public async getParticipationsWithNoMessageByEventUid(eventUid: string): Promise<Participation[]> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const messageIsReceived: QueryConstraint = where('messageIsReceived', '==', false);
    const isActive: QueryConstraint = where('isActive', '==', true);
    const constraints = [eventUidConstraint, messageIsReceived, isActive];
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
    const nameOrderBy = orderBy('name');
    const lastNameOrderBy = orderBy('lastName');
    const constraints: QueryConstraint[] = [
      idConstraint,
      isActiveOrderBy,
      messageIsReceivedOrderBy,
      nameOrderBy,
      lastNameOrderBy
    ];
    const participations: Observable<Participation[]> =
      this.firebaseReadService.getRealTimeDocumentsByMultipleConstraints(
        environment.collection.PARTICIPATIONS,
        constraints,
        participationConverter
      );
    return participations;
  }

  /* ------------------------------------------- UPDATE ------------------------------------------- */
  public async updateParticipationNotActive(participationUid: string): Promise<void> {
    const propsToUpdate = { isActive: false };
    await this.firebaseUpdateService.updateDocumentProps(
      environment.collection.PARTICIPATIONS,
      participationUid,
      propsToUpdate
    );
  }

  public async scanAndGetParticipation(participationUid: string, employeeUid: string): Promise<Participation> {
    const participation: Participation = await this.firebaseReadService.getDocumentByUid(
      environment.collection.PARTICIPATIONS,
      participationUid,
      participationConverter
    );

    if (!participation.props.isScanned && participation.props.isActive) {
      const propsToUpdate = {
        isScanned: true,
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

  public async scanMultipleParticipations(participations: Participation[]): Promise<void> {
    await this.firebaseUpdateService.updateDocuments(environment.collection.PARTICIPATIONS, participations);
  }
}
