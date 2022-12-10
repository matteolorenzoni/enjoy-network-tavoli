/* eslint-disable prefer-destructuring */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInAnimation } from 'src/app/animations/animations';
import { EventService } from 'src/app/services/event.service';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PlaceType } from '../../../../models/enum';

@Component({
  selector: 'app-event-generator',
  templateUrl: './event-generator.component.html',
  styleUrls: ['./event-generator.component.scss'],
  animations: [fadeInAnimation]
})
export class EventGeneratorComponent implements OnInit {
  /* Type */
  places = Object.values(PlaceType);

  /* Event */
  uid = '';

  /* Form */
  photoFile!: File;
  eventForm: FormGroup;
  imageSrc: string | ArrayBuffer | null = null;
  isLoading: boolean;

  /* Label */
  lblButton = 'Crea evento';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private eventService: EventService,
    private toastService: ToastService
  ) {
    this.eventForm = new FormGroup({
      imageUrl: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)]),
      date: new FormControl(null, [Validators.required]),
      timeStart: new FormControl('11:00', [Validators.required, Validators.pattern(/^[0-9]{2}:[0-9]{2}$/)]),
      timeEnd: new FormControl('05:00', [Validators.required, Validators.pattern(/^[0-9]{2}:[0-9]{2}$/)]),
      maxPerson: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]*$/)]),
      place: new FormControl(PlaceType.BACCARA, [Validators.required]),
      guest: new FormControl(null),
      description: new FormControl(null),
      messageText: new FormControl(null)
    });
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid') || '';
    if (this.uid && this.uid !== '' && this.uid !== 'null') {
      this.eventService.getEvent(this.uid).then((event) => {
        if (event) {
          this.eventForm.patchValue({
            imageUrl: event.imageUrl,
            name: event.name,
            date: event.date.toJSON().split('T')[0],
            timeStart: event.timeStart,
            timeEnd: event.timeEnd,
            maxPerson: event.maxPerson,
            place: event.place,
            guest: event.guest,
            description: event.description,
            messageText: event.messageText
          });
          this.imageSrc = event.imageUrl;
          this.lblButton = 'Modifica evento';
        }
      });
    }
  }

  public onSubmit() {
    this.isLoading = true;
    this.eventService
      .addOrUpdateEvent(this.photoFile, this.eventForm.value, this.uid)
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

  public removePhoto() {
    this.eventForm.patchValue({ imageUrl: null });
    this.imageSrc = null;
  }
}
