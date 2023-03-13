import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { AssignmentService } from 'src/app/services/assignment.service';
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
  /* Employee */
  employeeUid = '';

  /* Events */
  eventsAvailable: Event[] = [];

  constructor(
    private userService: UserService,
    private assignmentService: AssignmentService,
    private eventService: EventService,
    private toastService: ToastService
  ) {
    this.employeeUid = this.userService.getUserUid();
  }

  ngOnInit() {
    if (!this.employeeUid) {
      throw new Error('Errore: parametri non validi');
    }

    this.assignmentService
      .getAssignmentsByEmployeeUid(this.employeeUid)
      .then((assignments) => {
        const eventUids = assignments.map((assignment) => assignment.props.eventUid);
        this.eventService
          .getEventsByUids(eventUids)
          .then((events) => {
            this.eventsAvailable = events;
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
