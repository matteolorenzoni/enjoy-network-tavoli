/* eslint-disable operator-linebreak */
import {
  faArrowUpFromBracket,
  faCalendar,
  faCopy,
  faPhone,
  faQrcode,
  faRotateRight,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SessionStorageService } from '../services/sessionstorage.service';
import { ToastService } from '../services/toast.service';
import { ParticipationService } from '../services/participation.service';
import { Participation } from '../models/type';

@Component({
  selector: 'en-item-participation[participation]',
  template: `
    <li
      class="flex items-center gap-4 overflow-hidden rounded-md p-2 text-slate-300"
      [ngClass]="{
        'bg-slate-900': participation.props.messageIsReceived && participation.props.isActive,
        'bg-red-700': !participation.props.messageIsReceived && participation.props.isActive,
        'bg-emerald-400/50': participation.props.scannedAt && participation.props.isActive,
        'bg-slate-800 opacity-20': !participation.props.isActive
      }">
      <div class="flex grow flex-col gap-1 truncate">
        <p class="truncate">{{ participation.props.name }} {{ participation.props.lastName }}</p>

        <p class="truncate text-xs text-slate-400">
          <fa-icon class="pr-1" [icon]="phoneIcon"></fa-icon>
          {{ participation.props.phone }}
        </p>

        <ng-container *ngIf="participation.props.scannedAt; else elseTemplate">
          <p class="truncate text-xs text-slate-400">
            <fa-icon class="pr-1" [icon]="qrCodeIcon"></fa-icon>
            {{ participation.props.scannedAt | date: 'dd/MM/YYYY' }} -
            {{ participation.props.scannedAt | date: 'HH:mm' }}
          </p>
        </ng-container>
        <ng-template #elseTemplate>
          <p class="truncate text-xs text-slate-400">
            <fa-icon class="pr-1" [icon]="calendarIcon"></fa-icon>
            {{ participation.props.modifiedAt | date: 'dd/MM/YYYY' }} -
            {{ participation.props.modifiedAt | date: 'HH:mm' }}
          </p>
        </ng-template>
      </div>

      <div class="flex shrink-0 gap-3 text-xl text-slate-300">
        <fa-icon
          *ngIf="canShare"
          [icon]="shareIcon"
          role="button"
          class="p-1 transition duration-150 ease-in-out hover:cursor-pointer active:text-slate-500"
          (click)="shareTicketLink(participation.uid)"></fa-icon>
        <fa-icon
          *ngIf="!canShare"
          [icon]="copyIcon"
          role="button"
          class="p-1 transition duration-150 ease-in-out hover:cursor-pointer active:text-slate-500"
          (click)="copyTicketLink(participation.uid)"></fa-icon>
        <fa-icon
          [icon]="deleteIcon"
          role="button"
          class="p-1 transition duration-150 ease-in-out hover:cursor-pointer active:text-slate-500"
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

  /* Event */
  eventUid: string | null = null;

  /* Employee */
  employeeUid: string | null = null;

  /* Icons */
  rotateIcon = faRotateRight;
  shareIcon = faArrowUpFromBracket;
  copyIcon = faCopy;
  deleteIcon = faTrash;
  phoneIcon = faPhone;
  calendarIcon = faCalendar;
  qrCodeIcon = faQrcode;

  /* Subscriptions */
  subIsActive!: Subscription;

  /* Navigator */
  canShare = false;

  /* ------------------------------ Constructor ------------------------------ */
  constructor(
    private http: HttpClient,
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
    const { origin } = window.location;
    const link = `${origin}/ticket?participation=${participationUid}`;

    const shareData = {
      title: 'Condividi ticket',
      text: `Link per la partecipazione all'evento di ${this.participation.props.name} ${this.participation.props.lastName}`,
      url: link
    };

    if (navigator.canShare(shareData)) {
      await navigator.share(shareData);
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
        throw new Error('Parametri non validi');
      }

      this.participationService
        .updateParticipationNotActive(this.participation.uid)
        .then(() => {
          this.toastService.showSuccess('Partecipazione rimossa');
        })
        .catch((error) => {
          this.toastService.showError(error);
        });
    }
  }
}
