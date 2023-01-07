import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/models/type';

@Component({
  selector: 'en-item-event-available',
  template: `
    <li
      class="group my-4 h-16 rounded-xl bg-gray-900 p-2 shadow shadow-gray-800 transition-all hover:cursor-pointer hover:bg-primary-60"
      (click)="goToSelector()">
      <div class="flex group-hover:hidden">
        <div>
          <p class="text-xl font-medium text-primary-60">{{ event.props.name }}</p>
          <p class="text-xs font-light">{{ event.props.place }}</p>
        </div>
        <div class="center ml-auto rounded-xl bg-gray-800 p-2 text-primary-60">
          <p>{{ event.props.date | date: 'dd/MM/YYYY' }}</p>
        </div>
      </div>
      <div class="hidden h-full group-hover:flex">
        <p class="m-auto text-sm tracking-widest text-black">TAVOLI</p>
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
    this.router.navigate([this.event.uid], { relativeTo: this.route });
  }
}
