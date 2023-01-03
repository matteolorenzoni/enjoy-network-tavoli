import { Injectable } from '@angular/core';
import { documentId, QueryConstraint, where } from '@angular/fire/firestore';
import { assignmentConverter, eventConverter } from '../models/converter';
import { Collection, EventDTO } from '../models/collection';
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

  public async getAllEvents(): Promise<Event[]> {
    const events = await this.firebaseReadService.getAllDocuments(Collection.EVENTS, eventConverter);
    return events;
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
  public async addOrUpdateEvent(photo: File | null, uid: string | null, eventDTO: EventDTO): Promise<void> {
    let { imageUrl } = eventDTO;

    if (photo) {
      /* Add new image */
      const photoUrl = await this.firebaseStorage.addPhotoToEvent(eventDTO, photo);
      imageUrl = photoUrl;
    }

    if (!uid) {
      /* Add new event */
      const event: Event = { uid: '', eventDTO };
      event.eventDTO.imageUrl = imageUrl;
      await this.firebaseCreateService.addEvent(event);
    } else {
      /* Update document */
      const event: Event = { uid, eventDTO };
      event.eventDTO.imageUrl = imageUrl;
      await this.firebaseUpdateService.updateEvent(event);
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
    await this.firebaseDeleteService.deleteAssignments(assignments);

    /* Delete image */
    const photoUrl = event.eventDTO.imageUrl;
    try {
      const photoName = photoUrl.split('%2F')[1].split('?')[0];
      await this.firebaseStorage.deletePhoto(photoName);
    } catch (error) {
      console.error('No photo');
    }

    /* Delete event */
    await this.firebaseDeleteService.deleteEventByUid(event.uid);
  }
}
