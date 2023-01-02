import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'en-countdown[date]',
  template: `
    <div *ngIf="date" class="center grid auto-cols-max grid-flow-col gap-5 text-center">
      <div class="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
        <span class="font-mono countdown text-5xl">
          <span [style]="'--value: ' + days"></span>
        </span>
        GIORNI
      </div>
      <div class="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
        <span class="font-mono countdown text-5xl">
          <span [style]="'--value: ' + hours"></span>
        </span>
        ORE
      </div>
      <div class="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
        <span class="font-mono countdown text-5xl">
          <span [style]="'--value: ' + minutes"></span>
        </span>
        MINUTI
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class EnCountdownComponent implements OnChanges {
  @Input() date!: Date | null;

  /* Values */
  days = 0;
  hours = 0;
  minutes = 0;

  /* Subscriptions */
  countdownSubscription: Subscription | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date']) {
      const currentValue = changes['date'].currentValue as Date;
      const diff = new Date(currentValue).getTime() - new Date().getTime();
      const days = diff / (1000 * 60 * 60 * 24);
      const hours = diff / (1000 * 60 * 60);
      const minutes = diff / (1000 * 60);
      this.days = Math.floor(days);
      this.hours = Math.floor(hours - this.days * 24);
      this.minutes = Math.floor(minutes - this.hours * 60 - this.days * 24 * 60);
    }
  }
}
