import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { fadeInAnimation, staggeredFadeInIncrement } from 'src/app/animations/animations';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/type';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-event',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  animations: [fadeInAnimation, staggeredFadeInIncrement]
})
export class EventListComponent implements OnInit {
  /* Icons */
  plusIcon = faPlus;
  filterIcon = faFilter;

  /* Events */
  events: Event[] = [];

  constructor(private router: Router, private eventService: EventService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.getEvents();
  }

  goToCreateEvent(): void {
    this.router.navigate(['create-item/event/null']);
  }

  getEvents(): void {
    this.eventService
      .getAllEvents()
      .then((events) => {
        this.events = events;
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });
  }
}
