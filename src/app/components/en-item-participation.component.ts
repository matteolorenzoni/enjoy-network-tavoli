import { faArrowUpFromBracket, faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SessionStorageService } from '../services/sessionstorage.service';
import { ToastService } from '../services/toast.service';
import { ParticipationService } from '../services/participation.service';
import { Participation } from '../models/type';

@Component({
  selector: 'en-item-participation[participation]',
  template: `
    <li
      class="my-2 flex h-12 items-center rounded-lg px-2"
      [ngClass]="{ 'bg-red-600/30': !participation.props.messageIsReceived }">
      <div class="grow truncate">
        <p>
          {{ participation.props.name }} {{ participation.props.lastName }}
          <span class="ml-4 text-xs">({{ participation.props.phone }})</span>
        </p>
        <p class="text-xs text-gray-500">
          {{ participation.props.createdAt | date: 'dd/MM/YYYY' }} - {{ participation.props.createdAt | date: 'HH:mm' }}
        </p>
      </div>

      <div class="flex shrink-0 gap-4 pl-4">
        <fa-icon
          *ngIf="canShare"
          [icon]="shareIcon"
          class="text-lg text-gray-400 hover:cursor-pointer hover:text-gray-300 active:text-gray-800"
          (click)="shareTicketLink(participation.uid)"></fa-icon>
        <fa-icon
          [icon]="copyIcon"
          class="text-lg text-gray-400 hover:cursor-pointer hover:text-gray-300 active:text-gray-800"
          (click)="copyTicketLink(participation.uid)"></fa-icon>
        <fa-icon
          [icon]="deleteIcon"
          class="text-lg text-gray-400 hover:cursor-pointer hover:text-gray-300 active:text-gray-800"
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
  @Input() participation!: Participation;
  @Output() participationNotActiveEvent = new EventEmitter<any>();

  /* Event */
  eventUid: string | null = null;

  /* Employee */
  employeeUid: string | null = null;

  /* Icons */
  shareIcon = faArrowUpFromBracket;
  copyIcon = faCopy;
  deleteIcon = faTrash;

  /* Subscriptions */
  subIsActive!: Subscription;

  /* Navigator */
  canShare = false;

  /* ------------------------------ Constructor ------------------------------ */
  constructor(
    private route: ActivatedRoute,
    private participationService: ParticipationService,
    private sessionStorageService: SessionStorageService,
    private toastService: ToastService
  ) {
    this.canShare = navigator.share !== undefined;
  }

  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');
    this.employeeUid = this.sessionStorageService.getEmployeeUid();
  }

  /* ------------------------------ Methods ------------------------------ */
  async shareTicketLink(participationUid: string): Promise<void> {
    try {
      const { origin } = window.location;
      const link = `${origin}/ticket?participation=${participationUid}`;

      const shareData = {
        title: 'Ticket',
        text: "Link per la partecipazione all'evento",
        url: link
      };

      await navigator.share(shareData);
    } catch (e: any) {
      this.toastService.showError(e);
    }
  }

  copyTicketLink(participationUid: string): void {
    const { origin } = window.location;
    const link = `${origin}/ticket?participation=${participationUid}`;
    navigator.clipboard.writeText(link);
    this.toastService.showSuccess('Link copiato');
  }

  updateParticipationNotActive(): void {
    const text = 'Sei sicuro di voler rimuovere la partecipazione?';
    if (window.confirm(text) === true) {
      if (!this.eventUid || !this.employeeUid || !this.participation.uid) {
        throw new Error('Errore: parametri non validi');
      }

      this.participationService
        .updateParticipationNotActive(this.eventUid, this.employeeUid, this.participation.uid)
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
