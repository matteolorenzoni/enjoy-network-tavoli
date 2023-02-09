import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-selector',
  templateUrl: './event-selector.component.html',
  styleUrls: ['./event-selector.component.scss']
})
export class EventSelectorComponent {
  /* Form */
  eventForm: FormGroup;
  isLoading: boolean;

  constructor() {
    /* Init form */
    this.eventForm = new FormGroup({
      eventCode: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)])
    });

    this.isLoading = false;
  }

  onSubmit() {
    console.log(this.eventForm.value.eventCode);
  }
}
