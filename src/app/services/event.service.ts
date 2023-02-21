import { Injectable } from '@angular/core';
import { documentId, QueryConstraint, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { assignmentConverter, eventConverter } from '../models/converter';
import { Assignment, Event } from '../models/type';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseUpdateService } from './firebase/firebase-crud/firebase-update.service';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseDeleteService } from './firebase/firebase-crud/firebase-delete.service';
import { FirebaseStorageService } from './firebase/firebase-storage.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(
    private firebaseCreateService: FirebaseCreateService,
    private firebaseReadService: FirebaseReadService,
    private firebaseUpdateService: FirebaseUpdateService,
    private firebaseDeleteService: FirebaseDeleteService,
    private firebaseStorage: FirebaseStorageService
  ) {}

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getEvent(eventUid: string): Promise<Event> {
    const event = await this.firebaseReadService.getDocumentByUid(
      environment.collection.EVENTS,
      eventUid,
      eventConverter
    );
    return event;
  }

  public getRealTimeAllEvents(): Observable<Event[]> {
    const employees: Observable<Event[]> = this.firebaseReadService.getRealTimeAllDocuments(
      environment.collection.EVENTS,
      eventConverter
    );
    return employees;
  }

  public async getEventsByUids(eventUids: string[]): Promise<Event[]> {
    if (!eventUids || eventUids.length === 0) return [];

    const eventPromises: Promise<Event[]>[] = [];

    for (let i = 0; i < eventUids.length; i += 10) {
      const eventUidConstraint: QueryConstraint = where(documentId(), 'in', eventUids.slice(i, i + 10));
      const constraints: QueryConstraint[] = [eventUidConstraint];
      const promise = this.firebaseReadService.getDocumentsByMultipleConstraints(
        environment.collection.EVENTS,
        constraints,
        eventConverter
      );
      eventPromises.push(promise);
    }

    const events: Event[][] = await Promise.all(eventPromises);

    return events.flat();
  }

  public async getEventByCode(code: string): Promise<Event | null> {
    const codeConstraint: QueryConstraint = where('code', '==', code);
    const constraints: QueryConstraint[] = [codeConstraint];
    const events = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.EVENTS,
      constraints,
      eventConverter
    );

    return events && events.length > 0 ? events[0] : null;
  }

  /* ------------------------------------------- ADD ------------------------------------------- */
  public async addOrUpdateEvent(photo: File | null, event: Event): Promise<void> {
    const newEvent: Event = event;

    if (photo) {
      /* Add new image */
      newEvent.props.imageUrl = await this.firebaseStorage.addPhotoToEvent(event.props, photo);
    }

    if (!event.uid) {
      /* Add new event */
      await this.firebaseCreateService.addDocument(environment.collection.EVENTS, newEvent);
    } else {
      /* Update document */
      await this.firebaseUpdateService.updateDocument(environment.collection.EVENTS, newEvent);
    }
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteEvent(event: Event): Promise<void> {
    /* Delete assigments */
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', event.uid);
    const constraints: QueryConstraint[] = [eventUidConstraint];
    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );
    const assignmentUids = assignments.map((assignment) => assignment.uid);
    await this.firebaseDeleteService.deleteDocumentsByUids(environment.collection.ASSIGNMENTS, assignmentUids);

    /* Delete image */
    const photoUrl = event.props.imageUrl;
    try {
      const photoName = photoUrl.split('%2F')[1].split('?')[0];
      await this.firebaseStorage.deletePhoto(photoName);
    } catch (error) {
      console.error('No photo');
    }

    /* Delete event */
    await this.firebaseDeleteService.deleteDocumentByUid(environment.collection.EVENTS, event.uid);
  }
}
