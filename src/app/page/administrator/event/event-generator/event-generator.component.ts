/* eslint-disable prefer-destructuring */
import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInAnimation } from 'src/app/animations/animations';
import { EventService } from 'src/app/services/event.service';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { EventDTO } from 'src/app/models/type';
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
  photoFile: File | null = null;
  eventForm: FormGroup;
  imageSrc: string | ArrayBuffer | null = null;
  currentDate = new Date();
  isLoading: boolean;

  /* Label */
  lblButton = 'Crea evento';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private eventService: EventService,
    private toastService: ToastService,
    private date: DatePipe
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
    /* Event */
    const newEvent: EventDTO = {
      imageUrl: this.eventForm.value.imageUrl,
      name: this.eventForm.value.name?.trim().replace(/\s\s+/g, ' ') || '',
      date: new Date(this.eventForm.value.date),
      timeStart: this.eventForm.value.timeStart,
      timeEnd: this.eventForm.value.timeEnd,
      maxPerson: this.eventForm.value.maxPerson,
      place: this.eventForm.value.place,
      guest: this.eventForm.value.guest?.trim().replace(/\s\s+/g, ' ') || '',
      description: this.eventForm.value.description?.trim().replace(/\s\s+/g, ' ') || '',
      messageText: this.eventForm.value.messageText,
      createdAt: new Date(),
      modificatedAt: new Date()
    };
    const uidFormatted = this.uid === '' || this.uid === 'null' ? null : this.uid;
    this.eventService
      .addOrUpdateEvent(this.photoFile, newEvent, uidFormatted)
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
