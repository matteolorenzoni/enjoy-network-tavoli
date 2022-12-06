import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeIn } from 'src/app/animations/animations';

@Component({
  selector: 'app-event-generator',
  templateUrl: './event-generator.component.html',
  styleUrls: ['./event-generator.component.scss'],
  animations: [fadeIn]
})
export class EventGeneratorComponent {
  /* form */
  eventForm: FormGroup;
  imageSrc: string | ArrayBuffer | null = null;
  isLoading: boolean;

  constructor() {
    this.eventForm = new FormGroup({
      image: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      timeStart: new FormControl('11:00', [Validators.required]),
      timeEnd: new FormControl('05:00', [Validators.required]),
      maxPerson: new FormControl(null, [Validators.required]),
      place: new FormControl(null, [Validators.required]),
      guest: new FormControl(null),
      description: new FormControl(null),
      messageText: new FormControl(null)
    });
    this.isLoading = false;
  }

  public onSubmit() {
    this.isLoading = true;
    console.log(this.eventForm.value);
    this.isLoading = false;
  }

  // TODO: non funziona
  public dragPhoto(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.loadPhoto(e);
  }

  public loadPhoto(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    this.eventForm.patchValue({
      image: files[0]
    });
    if (files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        this.imageSrc = reader.result;
      };
    }
  }

  public removePhoto() {
    this.eventForm.patchValue({ image: null });
    this.imageSrc = null;
  }
}
