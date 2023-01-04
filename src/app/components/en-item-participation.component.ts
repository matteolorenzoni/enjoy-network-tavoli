import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { PartecipationAndClient } from '../models/type';

@Component({
  selector: 'en-item-participation[pc]',
  template: `
    <li class="flex h-12 items-center">
      <!-- <div class="mr-4 flex">
        <div>{{ isActive ? '🟠' : '⚪' }}</div>
        <div>{{ hasPayed ? '🟠' : '⚪' }}</div>
        <div>{{ hasScanned ? '🟠' : '⚪' }}</div>
      </div> -->
      <p class="truncate">
        {{ pc.client.props.name }} {{ pc.client.props.lastName }}
        <span class="ml-4 text-xs">{{ pc.participation.props.createdAt | date: 'dd/MM/YYYY' }}</span>
      </p>

      <div class="ml-auto">
        <fa-icon
          [icon]="deleteIcon"
          class="ml-4 text-lg text-gray-500 hover:cursor-pointer hover:text-gray-300 active:text-gray-800"
          (click)="deleteParticipation()"></fa-icon>
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
export class EnItemParticipationComponent {
  @Input() pc!: PartecipationAndClient;

  /* Icons */
  deleteIcon = faTrash;

  /* Participation */
  isActive = false;
  hasScanned = false;

  /* Subscriptions */
  subIsActive!: Subscription;

  /* ------------------------------ Constructor ------------------------------ */
  constructor() {
    // do nothing
  }

  /* ------------------------------ LifeCycle ------------------------------ */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pc']) {
      const currentValue = changes['pc'].currentValue as PartecipationAndClient;
      this.isActive = currentValue.participation.props.active;
      this.hasScanned = currentValue.participation.props.scanned;
    }
  }

  ngOnDestroy(): void {
    if (this.subIsActive) this.subIsActive.unsubscribe();
  }

  /* ------------------------------ Methods ------------------------------ */
  deleteParticipation(): void {
    console.log('deleteParticipation');
  }
}
