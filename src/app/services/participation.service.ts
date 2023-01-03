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

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getParticipationsByTableUid(tableUid: string): Promise<Participation[]> {
    const idConstraint: QueryConstraint = where('tableUid', '==', tableUid);
    const constraints: QueryConstraint[] = [idConstraint];
    const participations: Participation[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.PARTICIPATIONS,
      constraints,
      participationConverter
    );
    return participations;
  }

  /* ------------------------------------------- UPDATE ------------------------------------------- */
  public async updateParticipationPaymentProp(participationUid: string, hasPayed: boolean): Promise<void> {
    const participation: Participation = await this.firebaseReadService.getDocumentByUid(
      Collection.PARTICIPATIONS,
      participationUid,
      participationConverter
    );
    if (participation) {
      const propsToUpdate = { payed: hasPayed };
      await this.firebaseUpdateService.updateParticipationProps(participation, propsToUpdate);
    }
  }
}
