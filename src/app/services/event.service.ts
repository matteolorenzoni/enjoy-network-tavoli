import { Injectable } from '@angular/core';
import { addDoc, collection, getFirestore } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, UploadTaskSnapshot } from '@angular/fire/storage';
import { DatePipe } from '@angular/common';
import { Table } from '../models/table';
import { Event } from '../models/type';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  /* Firebase */
  private db = getFirestore();
  private storage = getStorage();

  constructor(private datePipe: DatePipe) {}

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
}
