import { Injectable } from '@angular/core';
import { documentId, QueryConstraint, where } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { clientConverter } from '../models/converter';
import { Client } from '../models/type';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase/firebase-crud/firebase-delete.service';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(
    private firebaseCreateService: FirebaseCreateService,
    private firebaseReadService: FirebaseReadService,
    private firebaseDeleteService: FirebaseDeleteService
  ) {}

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getAllClients(): Promise<Client[]> {
    const clients: Client[] = await this.firebaseReadService.getAllDocuments(
      environment.collection.CLIENTS,
      clientConverter
    );
    return clients;
  }

  public async getClient(clientUid: string): Promise<Client> {
    const client: Client = await this.firebaseReadService.getDocumentByUid(
      environment.collection.CLIENTS,
      clientUid,
      clientConverter
    );
    return client;
  }

  public async getClientsByUids(clientUids: string[]): Promise<Client[]> {
    if (!clientUids || clientUids.length === 0) return [];

    const clientPromises: Promise<Client[]>[] = [];

    for (let i = 0; i < clientUids.length; i += 10) {
      const idConstraint: QueryConstraint = where(documentId(), 'in', clientUids.slice(i, i + 10));
      const constricts: QueryConstraint[] = [idConstraint];
      const promise = this.firebaseReadService.getDocumentsByMultipleConstraints(
        environment.collection.CLIENTS,
        constricts,
        clientConverter
      );
      clientPromises.push(promise);
    }

    const clients: Client[][] = await Promise.all(clientPromises);
    return clients.flat();
  }

  public async getClientByPhone(phone: string): Promise<Client | null> {
    const phoneConstraint: QueryConstraint = where('phone', '==', phone);
    const constricts: QueryConstraint[] = [phoneConstraint];
    const clients: Client[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.CLIENTS,
      constricts,
      clientConverter
    );

    if (clients.length === 0) return null;
    return clients[0];
  }

  /* ------------------------------------------- CREATE ------------------------------------------- */
  /**
   * Check if the client already exists. If not add it, otherwise add the new client
   */
  public async addClient(client: Client): Promise<void> {
    /* Check if client already exists */
    const phoneConstraint: QueryConstraint = where('phone', '==', client.props.phone);
    const constricts: QueryConstraint[] = [phoneConstraint];
    const clients: Client[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.CLIENTS,
      constricts,
      clientConverter
    );

    if (clients.length === 0) {
      await this.firebaseCreateService.addDocument(environment.collection.CLIENTS, client);
    }
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteClient(clientUid: string): Promise<void> {
    await this.firebaseDeleteService.deleteDocumentByUid(environment.collection.CLIENTS, clientUid);
  }
}
