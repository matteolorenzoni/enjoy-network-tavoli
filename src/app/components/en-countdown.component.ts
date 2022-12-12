import { Component } from '@angular/core';

@Component({
  selector: 'en-countdown',
  template: `
    <div class="center grid auto-cols-max grid-flow-col gap-5 text-center">
      <div class="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
        <span class="font-mono countdown text-5xl">
          <span [style]="'--value: ' + 15"></span>
        </span>
        GIORNI
      </div>
      <div class="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
        <span class="font-mono countdown text-5xl">
          <span [style]="'--value: ' + 10"></span>
        </span>
        ORE
      </div>
      <div class="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
        <span class="font-mono countdown text-5xl">
          <span [style]="'--value: ' + 24"></span>
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
export class EnCountdownComponent {}
