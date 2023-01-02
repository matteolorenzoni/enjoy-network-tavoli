import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { AssignmentService } from 'src/app/services/assignment.service';
import { SessionStorageService } from 'src/app/services/sessionstorage.service';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/type';
import { ToastService } from 'src/app/services/toast.service';
import { staggeredFadeInIncrement } from 'src/app/animations/animations';

@Component({
  selector: 'app-event-active',
  templateUrl: './event-active.component.html',
  styleUrls: ['./event-active.component.scss'],
  animations: [staggeredFadeInIncrement]
})
export class EventActiveComponent implements OnInit {
  /* Events */
  eventsAvabile: Event[] = [];

  constructor(
    private sessionStorageService: SessionStorageService,
    private userService: UserService,
    private assignmentService: AssignmentService,
    private eventService: EventService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    const employeeUid = this.sessionStorageService.getEmployeeUid();

    if (!employeeUid) {
      throw new Error('Errore: parametri non validi');
    }

    this.assignmentService
      .getAssignmentsByEmployeeUid(employeeUid)
      .then((assignments) => {
        const eventUids = assignments.map((assignment) => assignment.assignmentDTO.eventUid);
        this.eventService
          .getEventsByUids(eventUids)
          .then((events) => {
            this.eventsAvabile = events;
          })
          .catch((error) => {
            this.toastService.showError(error);
          });
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }
}
