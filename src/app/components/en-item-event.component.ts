import { EventService } from 'src/app/services/event.service';
import { DatePipe } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { faPen, faPeopleGroup, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Event, Table } from 'src/app/models/type';
import { ToastService } from '../services/toast.service';
import { expandEventItemDetailsAnimation, fadeInAnimation } from '../animations/animations';
import { TableService } from '../services/table.service';
import { ParticipationService } from '../services/participation.service';

@Component({
  selector: 'en-item-event[event]',
  template: `
    <li class="my-4 mx-auto w-full overflow-hidden rounded-lg bg-slate-900 sm:w-3/5">
      <div class="relative hover:cursor-pointer" (click)="toggleOpen()">
        <img [src]="event.props.imageUrl" [alt]="dateFormatted + '_image'" class="object-scale-down" />
        <div
          [@fadeInAnimation]
          *ngIf="!isOpen"
          class="absolute inset-0 left-0 bottom-0 flex h-full flex-col items-center justify-end p-4 text-white ">
          <p
            class="mb-2 max-w-full truncate rounded-lg bg-primary-60/70 py-1 px-4 text-center text-base font-semibold xs:text-lg">
            {{ event.props.name }}
          </p>
          <p class="rounded-lg bg-primary-60/70 py-1 px-2 text-center text-xs xs:text-sm">
            {{ dateFormatted }} <br />
            {{ event.props.place }}
          </p>
        </div>
      </div>
      <div [@expandEventItemDetailsAnimation] *ngIf="isOpen" class="overflow-hidden bg-slate-900 p-2 text-white ">
        <ul class="divide-y divide-slate-700">
          <li *ngFor="let info of eventInfo" class="flex items-center px-2 py-1">
            <div
              class="flex shrink-0 basis-32 items-center justify-start whitespace-normal break-all text-base font-semibold text-primary-50">
              {{ info.label }}
            </div>
            <div class="text-base font-normal">{{ info.value }}</div>
          </li>
        </ul>
        <ul class="mt-4 flex gap-4">
          <li
            *ngFor="let icon of itemNavigationMenu"
            [routerLink]="icon.link"
            class="flex w-1/3 flex-col items-center rounded bg-primary-65 p-1 text-white hover:cursor-pointer hover:bg-paletteHover hover:text-paletteHover hover:shadow-lg">
            <a><fa-icon [icon]="icon.definition"></fa-icon></a>
            <span class="text-xs xs:text-sm">{{ icon.name }}</span>
          </li>
        </ul>
        <button
          type="button"
          class="mt-2 inline-block w-full rounded bg-red-600 px-6 py-2.5 text-xs font-extrabold uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-red-700 hover:shadow-lg"
          (click)="deleteEvent($event)">
          ELIMINA
        </button>
      </div>
    </li>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  animations: [fadeInAnimation, expandEventItemDetailsAnimation]
})
export class EnItemEventComponent {
  @Input() event!: Event;

  /* Event */
  isOpen = false;
  personMarked = 0;
  eventInfo: { label: string; value: string | number }[] = [];
  dateFormatted = '';

  /* Table */
  table: Table[] = [];

  /* Menu */
  itemNavigationMenu: any[] = [];

  constructor(
    private datePipe: DatePipe,
    private eventService: EventService,
    private tableService: TableService,
    private participationService: ParticipationService,
    private toastService: ToastService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event']) {
      this.dateFormatted = this.datePipe.transform(this.event.props.date, 'dd/MM/yyyy') || '';
      this.eventInfo.push({ label: 'Codice evento', value: this.event.props.code });
      this.eventInfo.push({ label: 'Nome', value: this.event.props.name });
      this.eventInfo.push({ label: 'Data', value: this.dateFormatted });
      this.eventInfo.push({ label: 'Paganti', value: this.personMarked });
      this.eventInfo.push({ label: 'Orario', value: `${this.event.props.timeStart} - ${this.event.props.timeEnd}` });
      this.eventInfo.push({ label: 'Luogo', value: this.event.props.place });
      this.eventInfo.push({ label: 'Ospite/i', value: this.event.props?.guest || '' });
      this.eventInfo.push({ label: 'Descrizione', value: this.event.props?.description || '' });
      this.eventInfo.push({ label: 'Messaggio', value: this.event.props.message });

      this.itemNavigationMenu = [
        { link: [`./${this.event.uid}/tables`], name: 'Tavoli', definition: faPeopleGroup },
        { link: [`./${this.event.uid}/assignments`], name: 'Dipendenti', definition: faUsers },
        { link: [`./${this.event.uid}`], name: 'Modifica', definition: faPen }
      ];

      this.getTable();
    }
  }

  /* --------------------------------------- HTTP Methods --------------------------------------- */
  deleteEvent(e: any): void {
    e.stopPropagation();

    const text = 'Sei sicuro di voler eliminare questo evento?';
    if (window.confirm(text) === true) {
      if (!this.event) {
        throw new Error('Errore: parametri non validi');
      }

      this.eventService
        .deleteEvent(this.event)
        .then(() => {
          this.isOpen = false;
          this.toastService.showSuccess('Evento eliminato');
        })
        .catch((err: Error) => {
          this.toastService.showError(err);
        });
    }
  }

  getTable(): void {
    this.tableService
      .getTableByEventUid(this.event.uid)
      .then((table: Table[]) => {
        this.table = table;
        this.getAllParticipations();
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });
  }

  getAllParticipations(): void {
    const tableUids = this.table.map((table: Table) => table.uid);
    this.participationService
      .getParticipationsCountByMultiTableUid(tableUids)
      .then((count) => {
        this.personMarked = count;
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });
  }

  /* --------------------------------------- Methods --------------------------------------- */
  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }
}
