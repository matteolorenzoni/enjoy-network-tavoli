import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { AssignmentService } from 'src/app/services/assignment.service';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/type';
import { ToastService } from 'src/app/services/toast.service';
import { staggeredFadeInIncrement } from 'src/app/animations/animations';
import { ActivatedRoute } from '@angular/router';

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
  eventUid?: string;
  eventsAvailable: Event[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private assignmentService: AssignmentService,
    private eventService: EventService,
    private toastService: ToastService
  ) {
    this.employeeUid = this.userService.getUserUid();
  }

  ngOnInit() {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid') || undefined;

    this.getData();
  }

  async getData() {
    if (!this.eventUid) {
      throw new Error('Parametri non validi');
    }

    try {
      const assignments = await this.assignmentService.getActiveAssignmentsByEventUidAndEmployeeUid(
        this.eventUid,
        this.employeeUid
      );
      const eventUids = assignments.map((assignment) => assignment.props.eventUid);
      this.eventsAvailable = await this.eventService.getEventsByUids(eventUids);
    } catch (error: any) {
      this.toastService.showError(error);
    }
  }
}
