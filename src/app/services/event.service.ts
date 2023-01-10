import { Injectable } from '@angular/core';
import { documentId, QueryConstraint, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { assignmentConverter, eventConverter } from '../models/converter';
import { Collection } from '../models/collection';
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
    const event = await this.firebaseReadService.getDocumentByUid(Collection.EVENTS, eventUid, eventConverter);
    return event;
  }

  public getRealTimeAllEvents(): Observable<Event[]> {
    const employees: Observable<Event[]> = this.firebaseReadService.getRealTimeAllDocuments(
      Collection.EVENTS,
      eventConverter
    );
    return employees;
  }

  public async getEventsByUids(eventUids: string[]): Promise<Event[]> {
    if (!eventUids || eventUids.length === 0) return [];

    const eventUidConstraint: QueryConstraint = where(documentId(), 'in', eventUids);
    const constraints: QueryConstraint[] = [eventUidConstraint];
    const eventsByAssignments = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.EVENTS,
      constraints,
      eventConverter
    );
    return eventsByAssignments;
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
      await this.firebaseCreateService.addDocument(Collection.EVENTS, newEvent);
    } else {
      /* Update document */
      await this.firebaseUpdateService.updateDocument(Collection.EVENTS, newEvent);
    }
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteEvent(event: Event): Promise<void> {
    /* Delete assigments */
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', event.uid);
    const constraints: QueryConstraint[] = [eventUidConstraint];
    const assignments: Assignment[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.ASSIGNMENTS,
      constraints,
      assignmentConverter
    );
    const assignmentUids = assignments.map((assignment) => assignment.uid);
    await this.firebaseDeleteService.deleteDocumentsByUids(Collection.ASSIGNMENTS, assignmentUids);

    /* Delete image */
    const photoUrl = event.props.imageUrl;
    try {
      const photoName = photoUrl.split('%2F')[1].split('?')[0];
      await this.firebaseStorage.deletePhoto(photoName);
    } catch (error) {
      console.error('No photo');
    }

    /* Delete event */
    await this.firebaseDeleteService.deleteDocumentByUid(Collection.EVENTS, event.uid);
  }
}
