import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, getDoc, getDocs, getFirestore, setDoc } from '@angular/fire/firestore';
import {
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot
} from '@angular/fire/storage';
import { DatePipe } from '@angular/common';
import { Table } from '../models/table';
import { Event, EventDTO, FirebaseDate } from '../models/type';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  /* Firebase */
  private db!: Firestore;
  private storage!: FirebaseStorage;

  constructor(private toastService: ToastService, private datePipe: DatePipe) {
    this.db = getFirestore();
    this.storage = getStorage();
  }

  /* ------------------------------------------- SET ------------------------------------------- */
  public async addOrUpdateEvent(photo: File, event: EventDTO, uid: string): Promise<void> {
    console.log('addOrUpdateEvent', photo, event, uid);
    /* Event */
    const newEvent: EventDTO = {
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
    if (photo) {
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
    }

    if (!uid) {
      /* Add document */
      await addDoc(collection(this.db, Table.EVENTS), newEvent);
    } else {
      /* Update document */
      await setDoc(doc(this.db, Table.EVENTS, uid), newEvent);
    }
  }

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getEvent(uid: string): Promise<EventDTO | null> {
    const docRef = doc(this.db, Table.EVENTS, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const eventDTO = docSnap.data() as EventDTO;
      const date = eventDTO.date as unknown as FirebaseDate;
      const createdAt = eventDTO.createdAt as unknown as FirebaseDate;
      const modificatedAt = eventDTO.modificatedAt as unknown as FirebaseDate;
      eventDTO.date = new Date(date.seconds * 1000);
      eventDTO.createdAt = new Date(createdAt.seconds * 1000);
      eventDTO.modificatedAt = new Date(modificatedAt.seconds * 1000);
      return eventDTO;
    }
    this.toastService.showError('Documento non trovato');
    return null;
  }

  public async getEvents(): Promise<Event[]> {
    const collectionRef = collection(this.db, Table.EVENTS);
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.size > 0) {
      return querySnapshot.docs.map((eventDoc) => {
        const uid = eventDoc.id;
        const eventDTO = eventDoc.data() as EventDTO;
        const date = eventDTO.date as unknown as FirebaseDate;
        const createdAt = eventDTO.createdAt as unknown as FirebaseDate;
        const modificatedAt = eventDTO.modificatedAt as unknown as FirebaseDate;
        eventDTO.date = new Date(date.seconds * 1000);
        eventDTO.createdAt = new Date(createdAt.seconds * 1000);
        eventDTO.modificatedAt = new Date(modificatedAt.seconds * 1000);
        return { uid, eventDTO };
      });
    }
    this.toastService.showError('Documento non trovato');
    return [];
  }
}
