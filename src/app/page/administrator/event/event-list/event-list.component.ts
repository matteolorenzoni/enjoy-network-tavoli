import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { fadeInAnimation, staggeredFadeInIncrement } from 'src/app/animations/animations';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/type';
import { ToastService } from 'src/app/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  animations: [fadeInAnimation, staggeredFadeInIncrement]
})
export class EventListComponent implements OnInit {
  /* Icons */
  filterIcon = faFilter;

  /* Events */
  events: Event[] = [];
  eventsSubscription!: Subscription;

  /* -------------------------------------- Constructor -------------------------------------- */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService,
    private toastService: ToastService
  ) {}

  /* -------------------------------------- LifeCycle -------------------------------------- */
  ngOnInit(): void {
    const that = this;
    this.eventsSubscription = this.eventService.getRealTimeAllEvents().subscribe({
      next(data) {
        that.events = data;
      },
      error(error: Error) {
        that.toastService.showError(error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.eventsSubscription) this.eventsSubscription.unsubscribe();
  }

  /* -------------------------------------- Methods -------------------------------------- */
  goToCreateEvent(): void {
    this.router.navigate(['./null'], { relativeTo: this.route });
  }
}
