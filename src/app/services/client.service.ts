import { Injectable } from '@angular/core';
import { DocumentData, documentId, DocumentReference, QueryConstraint, where } from '@angular/fire/firestore';
import { ClientDTO, Collection } from '../models/collection';
import { clientConverter } from '../models/converter';
import { Client, Participation } from '../models/type';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase/firebase-crud/firebase-delete.service';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseUpdateService } from './firebase/firebase-crud/firebase-update.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(
    private firebaseCreateService: FirebaseCreateService,
    private firebaseReadService: FirebaseReadService,
    private firebaseUpdateService: FirebaseUpdateService,
    private firebaseDeleteService: FirebaseDeleteService
  ) {}

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getAllClients(): Promise<Client[]> {
    const clients: Client[] = await this.firebaseReadService.getAllDocuments(Collection.CLIENTS, clientConverter);
    return clients;
  }

  public async getClient(clientUid: string): Promise<Client> {
    const client: Client = await this.firebaseReadService.getDocumentByUid(
      Collection.CLIENTS,
      clientUid,
      clientConverter
    );
    return client;
  }

  public async getClientsByUids(clientUids: string[]): Promise<Client[]> {
    if (!clientUids || clientUids.length === 0) return [];

    const idConstraint: QueryConstraint = where(documentId(), 'in', clientUids);
    const constricts: QueryConstraint[] = [idConstraint];
    const clients: Client[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.CLIENTS,
      constricts,
      clientConverter
    );
    return clients;
  }

  /* ------------------------------------------- CREATE ------------------------------------------- */
  public async addOrUpdateClient(uid: string | null, props: ClientDTO, tableUid: string): Promise<void> {
    if (!uid) {
      /* Add new client */
      const client: Client = { uid: '', props };
      const docRef: DocumentReference<DocumentData> = await this.firebaseCreateService.addDocument(
        Collection.CLIENTS,
        client
      );
      const clientUid: string = docRef.id;

      /* Add new participation */
      const participation: Participation = {
        uid: '',
        props: {
          tableUid,
          clientUid,
          active: true,
          scanned: false
        }
      };
      await this.firebaseCreateService.addDocument(Collection.PARTICIPATIONS, participation);
    } else {
      /* Update document */
      const client: Client = { uid, props };
      await this.firebaseUpdateService.updateDocument(Collection.CLIENTS, client);
    }
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteClient(clientUid: string): Promise<void> {
    await this.firebaseDeleteService.deleteDocumentByUid(Collection.CLIENTS, clientUid);
  }
}
