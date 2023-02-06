import { Injectable } from '@angular/core';
import { DocumentData, documentId, DocumentReference, QueryConstraint, where } from '@angular/fire/firestore';
import { Collection } from '../models/collection';
import { assignmentConverter, clientConverter } from '../models/converter';
import { Assignment, Client, Participation, SMS } from '../models/type';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase/firebase-crud/firebase-delete.service';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseUpdateService } from './firebase/firebase-crud/firebase-update.service';
import { SmsHostingService } from './sms-hosting.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(
    private firebaseCreateService: FirebaseCreateService,
    private firebaseReadService: FirebaseReadService,
    private firebaseUpdateService: FirebaseUpdateService,
    private firebaseDeleteService: FirebaseDeleteService,
    private smsHostingService: SmsHostingService
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

  public async getClientByPhone(phone: string): Promise<Client | null> {
    const phoneConstraint: QueryConstraint = where('phone', '==', phone);
    const constricts: QueryConstraint[] = [phoneConstraint];
    const clients: Client[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.CLIENTS,
      constricts,
      clientConverter
    );
    if (clients.length === 0) return null;
    return clients[0];
  }

  /* ------------------------------------------- CREATE ------------------------------------------- */
  public async addClient(
    client: Client,
    eventUid: string,
    employeeUid: string,
    tableUid: string,
    eventMessage: string
  ): Promise<void> {
    if (!client.uid) {
      /* Add new client */
      const docRef: DocumentReference<DocumentData> = await this.firebaseCreateService.addDocument(
        Collection.CLIENTS,
        client
      );
      const clientUid: string = docRef.id;

      /* Find assignment */
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

      /* Increase assignment */
      const assignment: Assignment = assignments[0];
      const propsToUpdate = { personMarked: assignment.props.personMarked + 1 };
      await this.firebaseUpdateService.updateDocumentProps(Collection.ASSIGNMENTS, assignment, propsToUpdate);

      /* Add new participation */
      const participation: Participation = {
        uid: '',
        props: {
          eventUid,
          tableUid,
          clientUid,
          isActive: true,
          isScanned: false
        }
      };
      await this.firebaseCreateService.addDocument(Collection.PARTICIPATIONS, participation);

      /* Send sms */
      const sms: SMS = {
        to: '393389108738',
        text: eventMessage,
        sandbox: true
      };
      this.smsHostingService.sendSms(sms).subscribe({
        next: (data) => console.log(data),
        error: (error: Error) => {
          throw new Error(error.message);
        }
      });
    }
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteClient(clientUid: string): Promise<void> {
    await this.firebaseDeleteService.deleteDocumentByUid(Collection.CLIENTS, clientUid);
  }
}
