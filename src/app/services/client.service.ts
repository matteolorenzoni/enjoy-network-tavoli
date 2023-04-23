import { Injectable } from '@angular/core';
import { orderBy, QueryConstraint, where } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { clientConverter } from '../models/converter';
import { Client } from '../models/type';
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

  /* ------------------------------------------- general ------------------------------------------- */
  public async getClientsByConstraint(constraints: QueryConstraint[]) {
    const clients: Client[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.CLIENTS,
      constraints,
      clientConverter
    );
    return clients;
  }

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getClients(): Promise<Client[]> {
    const nameOrderBy: QueryConstraint = orderBy('name');
    const lastNameOrderBy: QueryConstraint = orderBy('lastName');
    const constraints: QueryConstraint[] = [nameOrderBy, lastNameOrderBy];
    return this.getClientsByConstraint(constraints);
  }

  public async getClientByPhone(phone: string): Promise<Client | null> {
    const phoneConstraint: QueryConstraint = where('phone', '==', phone);
    const constraints: QueryConstraint[] = [phoneConstraint];
    const clients: Client[] = await this.getClientsByConstraint(constraints);
    if (clients.length === 0) return null;
    return clients[0];
  }

  /* ------------------------------------------- CREATE ------------------------------------------- */
  public async addClient(client: Client): Promise<void> {
    /* Check if client already exists */
    const phoneConstraint: QueryConstraint = where('phone', '==', client.props.phone);
    const constraints: QueryConstraint[] = [phoneConstraint];
    const clients: Client[] = await this.getClientsByConstraint(constraints);

    if (clients.length === 0) {
      await this.firebaseCreateService.addDocument(environment.collection.CLIENTS, client);
    }
  }

  /* ------------------------------------------- CREATE ------------------------------------------- */
  public async updateClient(client: Client): Promise<void> {
    await this.firebaseUpdateService.updateDocument(environment.collection.CLIENTS, client);
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteClient(client: Client): Promise<void> {
    await this.firebaseDeleteService.deleteDocumentByUid(environment.collection.CLIENTS, client.uid);
  }
}
