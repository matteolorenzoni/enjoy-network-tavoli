/* eslint-disable prefer-destructuring */
import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInAnimation } from 'src/app/animations/animations';
import { EventService } from 'src/app/services/event.service';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/models/type';
import { PlaceType } from 'src/app/models/enum';

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
  eventUid: string | null = null;

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
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');
    this.eventUid = this.eventUid === 'null' ? null : this.eventUid;

    if (!this.eventUid) {
      throw new Error('Parametri non validi');
    }

    if (this.eventUid) {
      this.eventService
        .getEvent(this.eventUid)
        .then((event) => {
          const { props } = event;
          if (event) {
            this.eventForm.patchValue({
              imageUrl: props.imageUrl,
              name: props.name,
              date: props.date.toJSON().split('T')[0],
              timeStart: props.timeStart,
              timeEnd: props.timeEnd,
              maxPerson: props.maxPerson,
              place: props.place,
              guest: props.guest,
              description: props.description,
              messageText: props.messageText
            });
            this.imageSrc = props.imageUrl;
            this.lblButton = 'Modifica evento';
          }
        })
        .catch((err: Error) => {
          this.toastService.showError(err);
        });
    }
  }

  public onSubmit() {
    this.isLoading = true;
    /* Event */
    const newEvent: Event = {
      uid: this.eventUid ?? '',
      props: {
        imageUrl: this.eventForm.value.imageUrl,
        name: this.eventForm.value.name?.trim().replace(/\s\s+/g, ' ') || '',
        date: new Date(this.eventForm.value.date),
        timeStart: this.eventForm.value.timeStart,
        timeEnd: this.eventForm.value.timeEnd,
        maxPerson: this.eventForm.value.maxPerson,
        place: this.eventForm.value.place,
        guest: this.eventForm.value.guest?.trim().replace(/\s\s+/g, ' ') || '',
        description: this.eventForm.value.description?.trim().replace(/\s\s+/g, ' ') || '',
        messageText: this.eventForm.value.messageText
      }
    };

    this.eventService
      .addOrUpdateEvent(this.photoFile, newEvent)
      .then(() => {
        this.imageSrc = null;
        this.eventForm.reset();
        this.location.back();
        this.toastService.showSuccess(newEvent.uid ? 'Evento modificato' : 'Evento creato');
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  public loadPhoto(e: any) {
    const files = (e.target as HTMLInputElement).files as FileList;
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
