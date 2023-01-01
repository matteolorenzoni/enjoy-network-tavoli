import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  deleteObject,
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot
} from '@angular/fire/storage';
import { EventDTO, Collection } from 'src/app/models/collection';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
  /* Firebase */
  private storage!: FirebaseStorage;

  constructor(private datePipe: DatePipe) {
    this.storage = getStorage();
  }

  public async addPhotoToEvent(event: EventDTO, photo: File): Promise<string> {
    const newEvent = event;

    const eventName = newEvent.name.toLowerCase().replace(/\s/g, '_');
    const eventDate = this.datePipe.transform(newEvent.date, 'dd_MM_yyyy');
    const imageType = photo.type.split('/')[1] || 'jpg';
    const photoNameFormatted = `${eventName}_${eventDate}.${imageType}`;
    const storageRef = ref(this.storage, `${Collection.EVENTS}/${photoNameFormatted}`);

    /* Upload */
    const snapshot: UploadTaskSnapshot = await uploadBytesResumable(storageRef, photo);
    if (!environment.production) console.info('Uploaded a blob or file!', snapshot);

    /* Get download URL */
    const downloadURL: string = await getDownloadURL(snapshot.ref);
    if (!environment.production) console.info('File available at', downloadURL);

    return downloadURL;
  }

  public async deletePhoto(imageUrl: string): Promise<void> {
    const storageRef = ref(this.storage, `${Collection.EVENTS}/${imageUrl}`);
    await deleteObject(storageRef);
    if (!environment.production) console.info('Foto eliminata:', imageUrl);
  }
}
