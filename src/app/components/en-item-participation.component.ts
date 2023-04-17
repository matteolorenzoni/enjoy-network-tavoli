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
import { Component, Input, SimpleChanges } from '@angular/core';
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
      class="relative flex items-center gap-4 overflow-hidden rounded-md p-2 text-slate-300"
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

      <div class="flex shrink-0 gap-4">
        <fa-icon
          *ngIf="reSendSMSButton"
          [icon]="rotateIcon"
          role="button"
          class="text-lg text-slate-300 transition duration-150 ease-in-out hover:cursor-pointer active:scale-90 active:text-slate-500"
          (click)="reSendSMS()"></fa-icon>
        <fa-icon
          *ngIf="canShare"
          [icon]="shareIcon"
          role="button"
          class="text-lg text-slate-300 transition duration-150 ease-in-out hover:cursor-pointer active:scale-90 active:text-slate-500"
          (click)="shareTicketLink(participation.uid)"></fa-icon>
        <fa-icon
          *ngIf="!canShare"
          [icon]="copyIcon"
          role="button"
          class="text-lg text-slate-300  transition duration-150 ease-in-out hover:cursor-pointer active:scale-90 active:text-slate-500"
          (click)="copyTicketLink(participation.uid)"></fa-icon>
        <fa-icon
          [icon]="deleteIcon"
          role="button"
          class="text-lg text-slate-300 transition duration-150 ease-in-out hover:cursor-pointer active:scale-90 active:text-slate-500"
          (click)="updateParticipationNotActive()"></fa-icon>
      </div>

      <div *ngIf="reSendSMSLoader" class="center absolute top-0 left-0 h-full w-full backdrop-blur-sm">
        <svg
          aria-hidden="true"
          class="mr-2 h-8 w-8 animate-spin fill-primary-50 text-white"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor" />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill" />
        </svg>
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

  /* SMS */
  reSendSMSLoader = false;
  reSendSMSButton? = false;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['participation']) {
      const value = changes['participation'].currentValue as Participation;
      const timestamp = new Date(Date.now() - 45 * 60000).getTime();

      if (!value.props.modifiedAt || value.props.scannedAt) return;

      this.reSendSMSButton =
        value.props.modifiedAt.getTime() < timestamp && value.props.isActive && !value.props.messageIsReceived;
    }
  }

  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');
    this.employeeUid = this.sessionStorageService.getEmployeeUid();
  }

  /* ------------------------------ Methods ------------------------------ */
  reSendSMS(): void {
    const url = `https://us-central1-enjoy-network-tavoli.cloudfunctions.net/reSendSMS?participationUid=${this.participation.uid}`;
    const header = { 'Access-Control-Allow-Origin': '*' };

    this.reSendSMSLoader = true;
    this.http.get(url, { headers: header }).subscribe({
      next: (response: any) => this.toastService.showSuccess(response.message),
      error: undefined
    });
  }

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
