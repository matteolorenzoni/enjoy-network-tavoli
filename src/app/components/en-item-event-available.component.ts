import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/models/type';

@Component({
  selector: 'en-item-event-available',
  template: `
    <li
      class="group min-h-16 my-4 flex flex-col rounded-xl bg-gray-900 p-2 shadow shadow-gray-800 transition-all hover:cursor-pointer"
      (click)="goToSelector()">
      <img [src]="event.props.imageUrl" alt="foto-evento" class="mb-4 h-20 w-full object-cover" />
      <div class="flex">
        <div>
          <p class="pb-2 text-xl font-medium text-primary-60">{{ event.props.name }}</p>
          <p class="text-xs font-light">{{ event.props.place }}</p>
        </div>
        <div class="center ml-auto rounded-xl bg-gray-800 p-2 text-primary-60">
          <p>{{ event.props.date | date: 'dd/MM/YYYY' }}</p>
        </div>
      </div>
    </li>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class EnItemEventAvailableComponent {
  @Input() event!: Event;

  constructor(private router: Router, private route: ActivatedRoute) {}

  goToSelector(): void {
    this.router.navigate([`./${this.event.uid}/tables`], { relativeTo: this.route });
  }
}
