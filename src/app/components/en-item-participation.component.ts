import { faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SessionStorageService } from '../services/sessionstorage.service';
import { ToastService } from '../services/toast.service';
import { ParticipationService } from '../services/participation.service';
import { ParticipationAndClient } from '../models/type';

@Component({
  selector: 'en-item-participation[pc]',
  template: `
    <li class="flex h-12 items-center">
      <p class="truncate ">
        {{ pc.client.props.name }} {{ pc.client.props.lastName }}
        <span class="ml-4 text-xs text-gray-500"
          >{{ pc.participation.props.createdAt | date: 'dd/MM/YYYY' }} -
          {{ pc.participation.props.createdAt | date: 'HH:mm' }}</span
        >
      </p>

      <div class="ml-auto">
        <fa-icon
          [icon]="copyIcon"
          class="ml-4 text-lg text-gray-400 hover:cursor-pointer hover:text-gray-300 active:text-gray-800"
          (click)="copyTicketLink(pc.participation.uid)"></fa-icon>

        <fa-icon
          [icon]="deleteIcon"
          class="ml-6 text-lg text-gray-400 hover:cursor-pointer hover:text-gray-300 active:text-gray-800"
          (click)="updateParticipationNotActive()"></fa-icon>
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
  @Output() participationNotActiveEvent = new EventEmitter<any>();

  /* Event */
  eventUid: string | null = null;

  /* Employee */
  employeeUid: string | null = null;

  /* Icons */
  copyIcon = faCopy;
  deleteIcon = faTrash;

  /* Subscriptions */
  subIsActive!: Subscription;

  /* ------------------------------ Constructor ------------------------------ */
  constructor(
    private route: ActivatedRoute,
    private participationService: ParticipationService,
    private sessionStorageService: SessionStorageService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');
    this.employeeUid = this.sessionStorageService.getEmployeeUid();
  }

  /* ------------------------------ Methods ------------------------------ */
  copyTicketLink(participationUid: string): void {
    const { origin } = window.location;
    const link = `${origin}/ticket?participation=${participationUid}`;
    navigator.clipboard.writeText(link);
    this.toastService.showSuccess('Link copiato');
  }

  updateParticipationNotActive(): void {
    const text = 'Sei sicuro di voler rimuovere la partecipazione?';
    if (window.confirm(text) === true) {
      if (!this.eventUid || !this.employeeUid || !this.pc.participation.uid) {
        throw new Error('Errore: parametri non validi');
      }

      this.participationService
        .updateParticipationNotActive(this.eventUid, this.employeeUid, this.pc.participation.uid)
        .then(() => {
          this.participationNotActiveEvent.emit();
          this.toastService.showSuccess('Partecipazione rimossa');
        })
        .catch((error) => {
          this.toastService.showError(error);
        });
    }
  }
}
