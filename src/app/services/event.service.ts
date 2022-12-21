import { Injectable } from '@angular/core';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { EventDTO } from '../models/table';
import { Assignment, Event } from '../models/type';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseUpdateService } from './firebase/firebase-crud/firebase-update.service';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseDeleteService } from './firebase/firebase-crud/firebase-delete.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(
    private firebaseCreateService: FirebaseCreateService,
    private firebaseReadService: FirebaseReadService,
    private firebaseUpdateService: FirebaseUpdateService,
    private firebaseDeleteService: FirebaseDeleteService
  ) {}

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getEvent(eventUid: string): Promise<Event> {
    const event = await this.firebaseReadService.getEventByUid(eventUid);
    return event;
  }

  public async getAllEvents(): Promise<Event[]> {
    const events = await this.firebaseReadService.getAllEvents();
    return events;
  }

  /* ------------------------------------------- ADD ------------------------------------------- */
  public async addOrUpdateEvent(photo: File | null, uid: string | null, eventDTO: EventDTO): Promise<void> {
    let { imageUrl } = eventDTO;

    if (photo) {
      /* Add new image */
      const photoUrl = await this.firebaseCreateService.addPhotoToEvent(eventDTO, photo);
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
    const assignments: Assignment[] = await this.firebaseReadService.getAssignmentsByMultipleConstraints(constraints);
    await this.firebaseDeleteService.deleteAssignments(assignments);

    /* Delete image */
    const photoUrl = event.eventDTO.imageUrl;
    try {
      const photoName = photoUrl.split('%2F')[1].split('?')[0];
      await this.firebaseDeleteService.deletePhoto(photoName);
    } catch (error) {
      console.error('No photo');
    }

    /* Delete event */
    await this.firebaseDeleteService.deleteEventByUid(event.uid);
  }
}
