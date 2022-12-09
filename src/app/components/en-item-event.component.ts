import { EventService } from 'src/app/services/event.service';
import { DatePipe } from '@angular/common';
import { Component, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { faPen, faUsers, faWineBottle } from '@fortawesome/free-solid-svg-icons';
import { Event, EventDTO } from 'src/app/models/type';
import { ToastService } from '../services/toast.service';
import { expandEventItemDetailsAnimation } from '../animations/animations';

@Component({
  selector: 'en-item-event[event][eventDeletedEvent]',
  template: `
    <li>
      <ng-container *ngIf="!isOpen; else elseTemplate">
        <div
          class="group relative h-16 overflow-hidden rounded-lg bg-gradient-to-r from-primary-65 to-primary-0 hover:cursor-pointer xs:h-20"
          (click)="toggleOpen()">
          <p class="center absolute inset-0 z-10 hidden text-white group-hover:flex group-hover:backdrop-blur-[2px]">
            APRI
          </p>
          <img
            [src]="eventDTO.imageUrl"
            [alt]="dateFormatted + '_image'"
            class="
              absolute
              -top-8
              -left-8
              h-32
              w-32
              overflow-hidden
              rounded-full
              object-cover
              group-hover:top-0
              group-hover:left-0
              group-hover:flex
              group-hover:h-full
              group-hover:w-full
              group-hover:rounded-none
              xs:-top-12
              xs:-left-10
              xs:h-48
              xs:w-48" />
          <div class="flex h-full w-full overflow-hidden pl-28 group-hover:hidden xs:pl-44">
            <div class="flex flex-col justify-center text-black">
              <p class="truncate text-xl font-bold xs:text-3xl xs:font-extrabold">{{ eventDTO.name }}</p>
              <p class="truncate text-lg font-medium xs:text-base xs:font-semibold">
                {{ dateFormatted }} ({{ eventDTO.place }})
              </p>
            </div>
            <div class="center absolute right-0 top-0 bottom-0 p-2 text-xl font-black xs:text-3xl">
              <p>{{ maxPersonFormatted }}</p>
            </div>
          </div>
        </div>
      </ng-container>
      <ng-template #elseTemplate>
        <div class="relative h-16 rounded-lg hover:cursor-pointer xs:h-20" (click)="toggleOpen()">
          <p class="center absolute inset-0 z-10 text-white backdrop-blur-[2px]">CHIUDI</p>
          <img
            [src]="eventDTO.imageUrl"
            [alt]="dateFormatted + '_image'"
            class="center relative h-full w-full object-cover" />
        </div>
      </ng-template>
      <div
        [@expandEventItemDetailsAnimation]
        *ngIf="isOpen"
        class="mt-2 overflow-hidden rounded bg-white p-2 text-black ">
        <ul class="divide-y divide-primary-85">
          <li *ngFor="let info of eventInfo" class="flex px-2 py-1">
            <div
              class="flex shrink-0 basis-32 items-center justify-start whitespace-normal break-all text-lg font-extrabold text-primary-50">
              {{ info.label }}
            </div>
            <div class="font-bold">{{ info.value }}</div>
          </li>
        </ul>
        <ul class="mt-4 flex gap-4">
          <li
            *ngFor="let icon of itemNavigationMenu"
            [routerLink]="icon.link"
            class="flex w-1/3 flex-col items-center rounded-md bg-primary-65 p-1 text-white hover:cursor-pointer hover:bg-paletteHover hover:text-paletteHover hover:shadow-lg">
            <a><fa-icon [icon]="icon.definition"></fa-icon></a>
            <span class="text-xs xs:text-sm">{{ icon.name }}</span>
          </li>
        </ul>
        <button
          type="button"
          class="mt-2 inline-block w-full rounded bg-red-600 px-6 py-2.5 text-xs font-extrabold uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-red-700 hover:shadow-lg"
          (click)="deleteEvent()">
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
  animations: [expandEventItemDetailsAnimation]
})
export class EnItemEventComponent {
  @Input() event!: Event;
  @Output() eventDeletedEvent: EventEmitter<any> = new EventEmitter();

  /* Props */
  isOpen = false;
  uid = '';
  eventDTO!: EventDTO;
  eventInfo: { label: string; value: string }[] = [];
  dateFormatted = '';
  maxPersonFormatted = '';

  /* Menu */
  itemNavigationMenu: any[] = [];

  constructor(private datePipe: DatePipe, private eventService: EventService, private toastService: ToastService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event']) {
      this.uid = this.event.uid;
      this.eventDTO = this.event.eventDTO;
      this.dateFormatted = this.datePipe.transform(this.eventDTO.date, 'dd/MM/yyyy') || '';
      this.maxPersonFormatted = `0/${this.eventDTO.maxPerson}`;
      this.eventInfo.push({ label: 'Nome', value: this.eventDTO.name });
      this.eventInfo.push({ label: 'Data', value: this.dateFormatted });
      this.eventInfo.push({ label: 'Paganti', value: this.maxPersonFormatted });
      this.eventInfo.push({ label: 'Orario', value: `${this.eventDTO.timeStart} - ${this.eventDTO.timeEnd}` });
      this.eventInfo.push({ label: 'Lougo', value: this.eventDTO.place });
      this.eventInfo.push({ label: 'Ospite/i', value: this.eventDTO.guest });
      this.eventInfo.push({ label: 'Descrizione', value: this.eventDTO.description });
      this.eventInfo.push({ label: 'Messaggio', value: this.eventDTO.messageText });

      this.itemNavigationMenu = [
        { link: '#', name: 'Tavoli', definition: faWineBottle },
        { link: '#', name: 'Dipendenti', definition: faUsers },
        { link: ['/create-item/event/', this.uid], name: 'Modifica', definition: faPen }
      ];
    }
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

  deleteEvent(): void {
    this.eventService
      .deleteEvent(this.uid)
      .then(() => {
        this.isOpen = false;
        this.toastService.showSuccess('Evento eliminato');
        this.eventDeletedEvent.emit();
      })
      .catch((error: Error) => {
        this.toastService.showError(error.message);
      });
  }
}
