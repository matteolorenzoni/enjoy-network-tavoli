import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'en-countdown[date]',
  template: `
    <div *ngIf="date" class="center grid auto-cols-max grid-flow-col gap-5 text-center">
      <div class="rounded-box flex w-20 flex-col items-center bg-neutral p-2 text-slate-300">
        <span class="font-mono countdown text-5xl">
          {{ days }}
        </span>
        GIORNI
      </div>
      <div class="rounded-box flex w-20 flex-col  items-center bg-neutral p-2 text-slate-300">
        <span class="font-mono countdown text-5xl">
          {{ hours }}
        </span>
        ORE
      </div>
      <div class="rounded-box flex w-20 flex-col  items-center bg-neutral p-2 text-slate-300">
        <span class="font-mono countdown text-5xl">
          {{ minutes }}
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
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor(diff / (1000 * 60));
      this.days = days;
      this.hours = hours - this.days * 24;
      this.minutes = minutes - this.hours * 60 - this.days * 24 * 60;
    }
  }
}
