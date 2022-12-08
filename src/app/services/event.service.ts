import { Injectable } from '@angular/core';
import { addDoc, collection, getDocs, getFirestore } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, UploadTaskSnapshot } from '@angular/fire/storage';
import { DatePipe } from '@angular/common';
import { Table } from '../models/table';
import { Event, FirebaseDate } from '../models/type';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  /* Firebase */
  private db = getFirestore();
  private storage = getStorage();

  constructor(private toastService: ToastService, private datePipe: DatePipe) {}

  /* ------------------------------------------- SET ------------------------------------------- */
  public async addEvent(photo: File, event: Event): Promise<void> {
    /* Event */
    const newEvent: Event = {
      imageUrl: event.imageUrl,
      name: event.name?.trim().replace(/\s\s+/g, ' ') || '',
      date: new Date(event.date),
      timeStart: event.timeStart,
      timeEnd: event.timeEnd,
      maxPerson: event.maxPerson,
      place: event.place,
      guest: event.guest?.trim().replace(/\s\s+/g, ' ') || '',
      description: event.description?.trim().replace(/\s\s+/g, ' ') || '',
      messageText: event.messageText,
      createdAt: new Date(),
      modificatedAt: new Date()
    };

    /* Image */
    const eventName = newEvent.name.toLowerCase().replace(/\s/g, '_');
    const eventDate = this.datePipe.transform(newEvent.date, 'dd_MM_yyyy');
    const imageType = photo.type.split('/')[1] || 'jpg';
    const photoNameFormatted = `${eventName}_${eventDate}.${imageType}`;
    const storageRef = ref(this.storage, `events/${photoNameFormatted}`);

    /* Upload */
    const snapshot: UploadTaskSnapshot = await uploadBytesResumable(storageRef, photo);

    /* Get download URL */
    const downloadURL: string = await getDownloadURL(snapshot.ref);
    newEvent.imageUrl = downloadURL;

    /* Add document */
    await addDoc(collection(this.db, Table.EVENTS), newEvent);
  }

  /* ------------------------------------------- GET ------------------------------------------- */
  async getEvents(): Promise<Event[]> {
    const collectionRef = collection(this.db, Table.EVENTS);
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.size > 0) {
      return querySnapshot.docs.map((eventDoc) => {
        const event = eventDoc.data() as Event;
        const date = event.date as unknown as FirebaseDate;
        const createdAt = event.createdAt as unknown as FirebaseDate;
        const modificatedAt = event.modificatedAt as unknown as FirebaseDate;
        event.date = new Date(date.seconds);
        event.createdAt = new Date(createdAt.seconds);
        event.modificatedAt = new Date(modificatedAt.seconds);
        return event;
      });
    }
    this.toastService.showError('Documento non trovato');
    return [];
  }
}
