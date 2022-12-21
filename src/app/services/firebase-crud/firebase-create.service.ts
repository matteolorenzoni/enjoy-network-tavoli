import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  DocumentData,
  DocumentReference,
  Firestore,
  addDoc,
  getFirestore,
  collection,
  writeBatch,
  doc
} from '@angular/fire/firestore';
import {
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot
} from '@angular/fire/storage';
import { EventDTO, Table } from 'src/app/models/table';
import { environment } from 'src/environments/environment';
import { Assignment, Employee, Event } from 'src/app/models/type';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCreateService {
  /* Firebase */
  private db!: Firestore;
  private storage!: FirebaseStorage;

  constructor(private datePipe: DatePipe) {
    this.db = getFirestore();
    this.storage = getStorage();
  }

  /* ------------------------------------------- EVENT ------------------------------------------- */
  public async addEvent(event: Event): Promise<DocumentReference<DocumentData>> {
    const { eventDTO } = event;
    eventDTO.createdAt = new Date();
    eventDTO.modificatedAt = new Date();
    const collectionRef = collection(this.db, Table.EVENTS);
    const docRef = await addDoc(collectionRef, eventDTO);
    if (!environment.production) console.info('Added event', eventDTO);
    return docRef;
  }

  public async addPhotoToEvent(event: EventDTO, photo: File): Promise<string> {
    const newEvent = event;

    const eventName = newEvent.name.toLowerCase().replace(/\s/g, '_');
    const eventDate = this.datePipe.transform(newEvent.date, 'dd_MM_yyyy');
    const imageType = photo.type.split('/')[1] || 'jpg';
    const photoNameFormatted = `${eventName}_${eventDate}.${imageType}`;
    const storageRef = ref(this.storage, `events/${photoNameFormatted}`);

    /* Upload */
    const snapshot: UploadTaskSnapshot = await uploadBytesResumable(storageRef, photo);
    if (!environment.production) console.info('Uploaded a blob or file!', snapshot);

    /* Get download URL */
    const downloadURL: string = await getDownloadURL(snapshot.ref);
    if (!environment.production) console.info('File available at', downloadURL);

    return downloadURL;
  }

  /* ------------------------------------------- ASSIGNEMNET ------------------------------------------- */
  public async addAssignments(assignments: Assignment[]): Promise<void> {
    const batch = writeBatch(this.db);
    const collectionRef = collection(this.db, Table.ASSIGNMENTS);
    assignments.forEach((assignment: Assignment) => {
      const docRef = doc(collectionRef);
      batch.set(docRef, assignment.assignmentDTO);
      if (!environment.production) console.info('Added assignment', assignment.assignmentDTO);
    });
    await batch.commit();
  }

  /* ------------------------------------------- EMPLOYEE ------------------------------------------- */
  public async addEmployee(employee: Employee): Promise<DocumentReference<DocumentData>> {
    const { employeeDTO } = employee;
    employeeDTO.createdAt = new Date();
    employeeDTO.modificatedAt = new Date();
    const collectionRef = collection(this.db, Table.EMPLOYEES);
    const docRef = await addDoc(collectionRef, employeeDTO);
    if (!environment.production) console.info('Added employee', employeeDTO);
    return docRef;
  }
}
