/* eslint-disable prefer-destructuring */
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeIn } from 'src/app/animations/animations';
import { EventService } from 'src/app/services/event.service';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';
import { PlaceType } from '../../../../models/enum';

@Component({
  selector: 'app-event-generator',
  templateUrl: './event-generator.component.html',
  styleUrls: ['./event-generator.component.scss'],
  animations: [fadeIn]
})
export class EventGeneratorComponent {
  /* Type */
  places = Object.values(PlaceType);

  /* Form */
  photoFile!: File;
  eventForm: FormGroup;
  imageSrc: string | ArrayBuffer | null = null;
  isLoading: boolean;

  constructor(private location: Location, private eventService: EventService, private toastService: ToastService) {
    this.eventForm = new FormGroup({
      imageUrl: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)]),
      date: new FormControl(null, [Validators.required]),
      timeStart: new FormControl('11:00', [Validators.required]),
      timeEnd: new FormControl('05:00', [Validators.required]),
      maxPerson: new FormControl(0, [Validators.required]),
      place: new FormControl(PlaceType.BACCARA, [Validators.required]),
      guest: new FormControl(null),
      description: new FormControl(null),
      messageText: new FormControl(null)
    });
    this.isLoading = false;
  }

  public onSubmit() {
    this.isLoading = true;
    this.eventService
      .addEvent(this.photoFile, this.eventForm.value)
      .then(() => {
        this.imageSrc = null;
        this.eventForm.reset();
        this.location.back();
        this.toastService.showSuccess('Evento creato');
      })
      .catch((error: Error) => {
        this.toastService.showError(error.message);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  public loadPhoto(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    if (files[0]) {
      this.eventForm.patchValue({ imageUrl: files[0].type });
      this.photoFile = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        this.imageSrc = reader.result;
      };
    }
  }

  // TODO: non funziona
  public dragPhoto(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.loadPhoto(e);
  }

  public removePhoto() {
    this.eventForm.patchValue({ imageUrl: null });
    this.imageSrc = null;
  }
}
