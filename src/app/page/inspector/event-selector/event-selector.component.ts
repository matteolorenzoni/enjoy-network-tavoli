import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-event-selector',
  templateUrl: './event-selector.component.html',
  styleUrls: ['./event-selector.component.scss']
})
export class EventSelectorComponent {
  /* Form */
  eventForm: FormGroup;
  isLoading: boolean;

  constructor(
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    /* Init form */
    this.eventForm = new FormGroup({
      eventCode: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)])
    });

    this.isLoading = false;
  }

  onSubmit() {
    this.eventService
      .getEventByCode(this.eventForm.value.eventCode)
      .then((event) => {
        if (event) {
          this.router.navigate(['/dashboard/inspector/participation-list'], { queryParams: { event: event.uid } });
        } else {
          this.toastService.showErrorMessage('Evento non trovato');
        }
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
      });
  }
}
