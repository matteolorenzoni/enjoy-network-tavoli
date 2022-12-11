import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  setDoc
} from '@angular/fire/firestore';
import {
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot
} from '@angular/fire/storage';
import { DatePipe } from '@angular/common';
import { EventDTO, Table } from '../models/table';
import { Event, FirebaseDate } from '../models/type';
import { EventEmployService } from './event-employ.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  /* Firebase */
  private db!: Firestore;
  private storage!: FirebaseStorage;

  constructor(private datePipe: DatePipe, private eventEmployService: EventEmployService) {
    this.db = getFirestore();
    this.storage = getStorage();
  }

  /* ------------------------------------------- SET ------------------------------------------- */
  public async addOrUpdateEvent(photo: File | null, event: EventDTO, uid: string | null): Promise<void> {
    const newEvent = event;

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
      const docRef = await addDoc(collection(this.db, Table.EVENTS), newEvent);
      /* Add event employee */
      await this.eventEmployService.addEventEmployee(docRef.id);
    } else {
      /* Update document */
      newEvent.modificatedAt = new Date();
      await setDoc(doc(this.db, Table.EVENTS, uid), newEvent);
    }
  }

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getEvent(eventUid: string): Promise<Event> {
    const docRef = doc(this.db, Table.EVENTS, eventUid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const uid = docSnap.id;
      const eventDTO = docSnap.data() as EventDTO;
      const date = eventDTO.date as unknown as FirebaseDate;
      const createdAt = eventDTO.createdAt as unknown as FirebaseDate;
      const modificatedAt = eventDTO.modificatedAt as unknown as FirebaseDate;
      eventDTO.date = new Date(date.seconds * 1000);
      eventDTO.createdAt = new Date(createdAt.seconds * 1000);
      eventDTO.modificatedAt = new Date(modificatedAt.seconds * 1000);
      return { uid, eventDTO };
    }
    throw new Error('Documento non trovato');
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
    return [];
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteEvent(uid: string): Promise<void> {
    /* Delete event employees */
    this.eventEmployService.deleteEventEmployees(uid);

    /* Delete event */
    await deleteDoc(doc(this.db, Table.EVENTS, uid));
  }
}
