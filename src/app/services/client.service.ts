import { Injectable } from '@angular/core';
import { DocumentData, documentId, DocumentReference, QueryConstraint, where } from '@angular/fire/firestore';
import { Collection } from '../models/collection';
import { assignmentConverter, clientConverter } from '../models/converter';
import { RoleType } from '../models/enum';
import { Assignment, Client, Participation } from '../models/type';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase/firebase-crud/firebase-delete.service';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseUpdateService } from './firebase/firebase-crud/firebase-update.service';
import { SessionStorageService } from './sessionstorage.service';
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
    private smsHostingService: SmsHostingService,
    private sessionStorageService: SessionStorageService
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

    const clientPromises: Promise<Client[]>[] = [];

    for (let i = 0; i < clientUids.length; i += 10) {
      const idConstraint: QueryConstraint = where(documentId(), 'in', clientUids.slice(i, i + 10));
      const constricts: QueryConstraint[] = [idConstraint];
      const promise = this.firebaseReadService.getDocumentsByMultipleConstraints(
        Collection.CLIENTS,
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
      const employeeRole = this.sessionStorageService.getEmployeeRole();
      if (assignments.length <= 0 && employeeRole !== RoleType.ADMINISTRATOR) {
        throw new Error('Si è verificato un errore, contatta uno staffer');
      }

      /* Increase assignment */
      if (employeeRole !== RoleType.ADMINISTRATOR) {
        const assignment: Assignment = assignments[0];
        const propsToUpdate = { personMarked: assignment.props.personMarked + 1 };
        await this.firebaseUpdateService.updateDocumentsProps(Collection.ASSIGNMENTS, [assignment], propsToUpdate);
      }

      /* Add new participation */
      const participation: Participation = {
        uid: '',
        props: {
          eventUid,
          tableUid,
          clientUid,
          isActive: true,
          isScanned: false,
          messageIsReceived: false
        }
      };
      const document: DocumentReference<DocumentData> = await this.firebaseCreateService.addDocument(
        Collection.PARTICIPATIONS,
        participation
      );

      /* Send sms */
      this.smsHostingService.shortenURL(document.id).subscribe({
        next: (shortenURL) => {
          console.log(shortenURL);
          this.smsHostingService
            .sendSms(`39${client.props.phone}`, eventMessage, {
              clientName: client.props.name,
              link: shortenURL.result.full_short_link
            })
            .subscribe({
              next: async (data) => {
                console.log(data);
                const participationPropsToUpdate = { messageIsReceived: true };
                await this.firebaseUpdateService.updateDocumentsProps(
                  Collection.PARTICIPATIONS,
                  [{ ...participation, uid: document.id }],
                  participationPropsToUpdate
                );
              },
              error: (error: Error) => {
                throw new Error(error.message);
              }
            });
        },
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
