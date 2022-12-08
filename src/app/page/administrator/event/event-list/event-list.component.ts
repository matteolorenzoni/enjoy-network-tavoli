import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { floatingButtonAnimation } from 'src/app/animations/animations';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/type';

@Component({
  selector: 'app-event',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  animations: [floatingButtonAnimation]
})
export class EventListComponent implements OnInit {
  /* Icons */
  plusIcon = faPlus;

  /* Events */
  events: Event[] = [];

  constructor(private router: Router, private eventService: EventService) {
    // do nothing
  }

  ngOnInit(): void {
    this.eventService.getEvents().then((events) => {
      this.events = events;
    });
  }

  goToCreateEvent(): void {
    this.router.navigate(['create-item/event/null']);
  }
}
