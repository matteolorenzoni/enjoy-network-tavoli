import { EventService } from 'src/app/services/event.service';
import { DatePipe } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { faPen, faPeopleGroup, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Event, Table } from 'src/app/models/type';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ToastService } from '../services/toast.service';
import { expandEventItemDetailsAnimation, fadeInAnimation } from '../animations/animations';
import { TableService } from '../services/table.service';
import { ParticipationService } from '../services/participation.service';

@Component({
  selector: 'en-item-event[event]',
  template: `
    <li class="my-4 mx-auto w-full overflow-hidden rounded-lg bg-slate-900 md:w-3/5">
      <div role="button" class="relative hover:cursor-pointer" (click)="toggleOpen()">
        <img [src]="event.props.imageUrl" [alt]="dateFormatted + '_image'" class="aspect-square object-contain " />
        <div
          [@fadeInAnimation]
          *ngIf="false"
          class="absolute inset-0 left-0 bottom-0 flex h-full flex-col items-center justify-end p-4 text-white ">
          <p
            class="mb-2 max-w-full truncate rounded-lg bg-primary-60/70 py-1 px-4 text-center text-base font-semibold xs:text-lg">
            {{ event.props.name }}
          </p>
          <p class="rounded-lg bg-primary-60/70 py-1 px-2 text-center text-xs xs:text-sm ">
            {{ dateFormatted }} <br />
            {{ event.props.place }}
          </p>
        </div>
      </div>
      <div [@expandEventItemDetailsAnimation] *ngIf="isOpen" class="overflow-hidden bg-slate-900 p-2 text-white">
        <ul class="divide-y divide-slate-700">
          <li *ngFor="let info of eventInfo" class="flex items-center px-2 py-1">
            <div
              class="flex shrink-0 basis-32 items-center justify-start whitespace-normal break-all text-sm font-semibold uppercase text-primary-50">
              {{ info.label }}
            </div>
            <div class="whitespace-pre-wrap text-base font-normal text-slate-300 ">{{ info.value }}</div>
          </li>
        </ul>
        <ul class="mt-4 flex gap-2">
          <li
            *ngFor="let icon of itemNavigationMenu"
            [routerLink]="icon.link"
            class="flex w-1/3 flex-col items-center rounded bg-primary-65 p-1 transition duration-150 ease-in-out hover:cursor-pointer active:scale-90 active:bg-primary-50 active:shadow-lg">
            <a><fa-icon [icon]="icon.definition"></fa-icon></a>
            <span class="text-xs xs:text-sm">{{ icon.name }}</span>
          </li>
        </ul>
        <div class="flex gap-2">
          <button
            type="button"
            role="button"
            class="mt-2 inline-block w-full rounded bg-cyan-600 px-6 py-2.5 text-xs font-extrabold uppercase shadow-md transition duration-150 ease-in-out hover:cursor-pointer active:scale-90 active:bg-cyan-800"
            (click)="downloadPDFTables()">
            PDF Tavoli
          </button>
          <button
            type="button"
            role="button"
            class="mt-2 inline-block w-full rounded bg-cyan-600 px-6 py-2.5 text-xs font-extrabold uppercase shadow-md transition duration-150 ease-in-out hover:cursor-pointer active:scale-90 active:bg-cyan-800"
            (click)="downloadPDFParticipants()">
            PDF Partecipanti
          </button>
        </div>
        <button
          type="button"
          role="button"
          class="mt-2 inline-block w-full rounded bg-red-600 px-6 py-2.5 text-xs font-extrabold uppercase shadow-md transition duration-150 ease-in-out hover:cursor-pointer active:scale-90 active:bg-red-800"
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
      this.eventInfo.push({ label: 'Limite tickets', value: this.event.props.maxPerson });
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
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });
  }

  /* --------------------------------------- Methods --------------------------------------- */
  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

  downloadPDFTables() {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

    try {
      this.table.forEach(async (table: Table) => {
        const participations = await this.participationService.getParticipationsByTableUid(table.uid);

        autoTable(doc, {
          head: [[{ content: `TAVOLO:  ${table.props.name}`, colSpan: 10 }], ['Numero', 'Nome', 'Cognome', 'Telefono']],
          body: participations.map((participation, index) => [
            index + 1,
            participation.props.name,
            participation.props.lastName,
            participation.props.phone
          ]),
          headStyles: { fillColor: [250, 137, 56] }
        });

        const eventName = this.event.props.name.replace(/\s/g, '_');
        doc.save(`tavoli_${eventName}.pdf`);
      });
    } catch (error: any) {
      this.toastService.showError(error);
    }
  }

  async downloadPDFParticipants() {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

    try {
      const participations = await this.participationService.getParticipationsByEventUid(this.event.uid);

      autoTable(doc, {
        head: [['Numero', 'Nome', 'Cognome', 'Telefono']],
        body: participations.map((participation, index) => [
          index + 1,
          participation.props.name,
          participation.props.lastName,
          participation.props.phone
        ]),
        headStyles: { fillColor: [250, 137, 56] }
      });

      const eventName = this.event.props.name.replace(/\s/g, '_');
      doc.save(`partecipanti_${eventName}.pdf`);
    } catch (error: any) {
      this.toastService.showError(error);
    }
  }
}
