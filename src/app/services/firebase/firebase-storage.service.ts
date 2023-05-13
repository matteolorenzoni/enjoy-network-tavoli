import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  FirebaseStorage,
  ref,
  UploadTaskSnapshot,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { EventDTO } from 'src/app/models/collection';
import { environment } from 'src/environments/environment';
import { InitializeService } from './initialize.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
  private storage: FirebaseStorage;

  constructor(private initializeService: InitializeService, private datePipe: DatePipe) {
    this.storage = this.initializeService.getStorage();
  }

  public async addPhotoToEvent(event: EventDTO, photo: File): Promise<string> {
    const newEvent = event;

    const eventName = newEvent.name.toLowerCase().replace(/\s/g, '_');
    const eventDate = this.datePipe.transform(newEvent.date, 'dd_MM_yyyy');
    const imageType = photo.type.split('/')[1] || 'jpg';
    const photoNameFormatted = `${eventName}_${eventDate}.${imageType}`;
    const storageRef = ref(this.storage, `${environment.collection.EVENTS}/${photoNameFormatted}`);

    /* Upload */
    const snapshot: UploadTaskSnapshot = await uploadBytesResumable(storageRef, photo);

    /* Get download URL */
    const downloadURL: string = await getDownloadURL(snapshot.ref);

    return downloadURL;
  }

  public async deletePhoto(imageUrl: string): Promise<void> {
    const storageRef = ref(this.storage, `${environment.collection.EVENTS}/${imageUrl}`);
    await deleteObject(storageRef);
  }
}
