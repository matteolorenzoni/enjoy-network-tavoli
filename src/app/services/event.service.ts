import { Injectable } from '@angular/core';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { EventDTO } from '../models/table';
import { Event } from '../models/type';
import { FirebaseCreateService } from './firebase-crud/firebase-create.service';
import { FirebaseUpdateService } from './firebase-crud/firebase-update.service';
import { FirebaseReadService } from './firebase-crud/firebase-read.service';
import { FirebaseDeleteService } from './firebase-crud/firebase-delete.service';
import { TransformService } from './transform.service';
import { RoleType } from '../models/enum';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(
    private firebaseCreateService: FirebaseCreateService,
    private firebaseReadService: FirebaseReadService,
    private firebaseUpdateService: FirebaseUpdateService,
    private firebaseDeleteService: FirebaseDeleteService,
    private transformService: TransformService,
    private datePipe: DatePipe
  ) {}

  /* ------------------------------------------- GET ------------------------------------------- */
  // OK
  public async getEvent(eventUid: string): Promise<Event> {
    const docSnap = await this.firebaseReadService.getEventByUid(eventUid);
    return this.transformService.qsToEvent(docSnap);
  }

  // OK
  public async getAllEvents(): Promise<Event[]> {
    const querySnapshot = await this.firebaseReadService.getAllEvents();
    return this.transformService.qsToEvents(querySnapshot);
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
      const docRef = await this.firebaseCreateService.addEvent(event);

      /* Add new event employee */
      const prConstraint: QueryConstraint = where('role', '==', RoleType.PR);
      const activeConstraint: QueryConstraint = where('active', '==', true);
      const constricts: QueryConstraint[] = [prConstraint, activeConstraint];
      const querySnapshot = await this.firebaseReadService.getEmployeesByMultipleConstraints(constricts);
      await this.firebaseCreateService.addEventEmployeeByEventUid(docRef.id, querySnapshot);
    } else {
      /* Update document */
      const event: Event = { uid, eventDTO };
      event.eventDTO.imageUrl = imageUrl;
      await this.firebaseUpdateService.updateEvent(event);
    }
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteEvent(event: Event): Promise<void> {
    /* Delete event employees */
    const querySnapshot = await this.firebaseReadService.getAllEventEmployees(event.uid);
    await this.firebaseDeleteService.deleteEventEmployeeByUid(event.uid, querySnapshot);

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
