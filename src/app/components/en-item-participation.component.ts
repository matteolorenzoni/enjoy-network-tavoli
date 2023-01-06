import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { ParticipationService } from '../services/participation.service';
import { ParticipationAndClient } from '../models/type';

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
          (click)="madeParticipationNotActive()"></fa-icon>
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
  @Input() pc!: ParticipationAndClient;

  /* Icons */
  deleteIcon = faTrash;

  /* Subscriptions */
  subIsActive!: Subscription;

  /* ------------------------------ Constructor ------------------------------ */
  constructor(private participationService: ParticipationService, private toastService: ToastService) {}

  /* ------------------------------ Methods ------------------------------ */
  madeParticipationNotActive(): void {
    this.participationService
      .madeParticipationNotActive(this.pc.participation.uid)
      .then(() => {
        this.toastService.showSuccess('Participazione rimossa');
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }
}
