import { Injectable } from '@angular/core';
import { ClientDTO } from '../models/collection';
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

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getAllClients(): Promise<Client[]> {
    const clients: Client[] = await this.firebaseReadService.getAllClients();
    return clients;
  }

  public async getClient(clientUid: string): Promise<Client> {
    const client: Client = await this.firebaseReadService.getClientByUid(clientUid);
    return client;
  }

  /* ------------------------------------------- CREATE ------------------------------------------- */
  public async addOrUpdateClient(uid: string | null, clientDTO: ClientDTO): Promise<void> {
    if (!uid) {
      /* Add new table */
      const client: Client = { uid: '', clientDTO };
      await this.firebaseCreateService.addClient(client);
    } else {
      /* Update document */
      const client: Client = { uid, clientDTO };
      await this.firebaseUpdateService.updateClient(client);
    }
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteClient(clientUid: string): Promise<void> {
    await this.firebaseDeleteService.deleteClientByUid(clientUid);
  }
}
