import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/models/type';

@Component({
  selector: 'en-item-event-available',
  template: `
    <li
      role="button"
      class="group relative my-4 mx-auto flex aspect-square w-full flex-col overflow-hidden rounded-lg bg-slate-900 md:w-3/5"
      (click)="goToSelector()">
      <img [src]="event.props.imageUrl" alt="foto-evento" class="aspect-square rounded-lg object-fill" />

      <div class="absolute left-0 bottom-0 flex w-full p-2 backdrop-blur">
        <div>
          <p class="pb-2 text-xl font-medium text-primary-60">{{ event.props.name }}</p>
          <p class="text-xs font-light text-slate-300">{{ event.props.place }}</p>
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
