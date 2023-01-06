import { Injectable } from '@angular/core';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { Collection } from '../models/collection';
import { participationConverter } from '../models/converter';
import { Participation } from '../models/type';
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
  public async addParticipation(tableUid: string, clientUid: string): Promise<void> {
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
  public async madeParticipationNotActive(participationUid: string): Promise<void> {
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
