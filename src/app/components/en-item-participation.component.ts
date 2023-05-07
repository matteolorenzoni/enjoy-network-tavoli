import {
  faArrowUpFromBracket,
  faCalendar,
  faCopy,
  faPhone,
  faQrcode,
  faRotateRight,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
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
      class="overflow-hidden rounded-md"
      [ngClass]="{
        'bg-slate-900': participation.props.messageIsReceived && participation.props.isActive,
        'bg-red-700': !participation.props.messageIsReceived && participation.props.isActive,
        'bg-emerald-400/50': participation.props.scannedAt && participation.props.isActive,
        'bg-slate-800 opacity-20': !participation.props.isActive
      }">
      <div #itemRef class="relative flex cursor-pointer ">
        <div class="flex w-full min-w-full items-center gap-4 p-2 text-slate-300" (click)="toggleIcons()">
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

          <div
            *ngIf="!participation.props.messageIsReceived"
            class="animate-pulse rounded bg-red-800 p-2 text-center text-xs">
            <ng-container *ngIf="(participation.props.messageAttempt || 1) < 3; else elseTemplate">
              <p>Tentativo n°{{ (participation.props.messageAttempt || 1) + 1 }} alle</p>
              <p>
                {{ newAttempt | date: 'dd/MM/YYYY' }} -
                {{ newAttempt | date: 'HH:mm' }}
              </p>
            </ng-container>
            <ng-template #elseTemplate>
              <div role="button" (click)="maxAttemptInfo()">
                <p>🚨Attenzione🚨</p>
                <p>Clicca per info</p>
              </div>
            </ng-template>
          </div>
        </div>

        <div #iconDiv class="flex items-center gap-3 p-2 text-xl text-slate-300">
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
  @ViewChild('itemRef') itemRef!: ElementRef<HTMLDivElement>;

  /* Event */
  eventUid: string | null = null;

  /* Employee */
  employeeUid: string | null = null;
  newAttempt?: Date;

  /* Subscriptions */
  subIsActive!: Subscription;

  /* Navigator */
  canShare = false;

  /* Item */
  isOpen = false;

  /* Icons */
  rotateIcon = faRotateRight;
  shareIcon = faArrowUpFromBracket;
  copyIcon = faCopy;
  deleteIcon = faTrash;
  phoneIcon = faPhone;
  calendarIcon = faCalendar;
  qrCodeIcon = faQrcode;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['participation']) {
      const { currentValue } = changes['participation'];
      const participationDTO = (currentValue as Participation).props;
      const { messageIsReceived, modifiedAt } = participationDTO;
      if (!messageIsReceived && modifiedAt) {
        const timestamp = modifiedAt.getTime();
        this.newAttempt = new Date(timestamp + 3 * 60 * 60 * 1000);
      }
    }
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

  toggleIcons(): void {
    this.itemRef.nativeElement.style.transform = `translateX(${this.isOpen ? 0 : -80}px)`;
    this.itemRef.nativeElement.style.transition = 'transform 0.5s ease-in-out';
    this.isOpen = !this.isOpen;
  }

  maxAttemptInfo(): void {
    alert(
      "Superato il numero di tentativi per l'invio del messaggio. Inviare manualmente attraverso il pulsante di share sulla destra e successivamente contattare uno staffer."
    );
  }
}
