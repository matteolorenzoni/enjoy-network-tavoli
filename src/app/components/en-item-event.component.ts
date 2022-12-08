import { DatePipe } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { faPen, faUsers, faWineBottle } from '@fortawesome/free-solid-svg-icons';
import { Event, IconLink } from 'src/app/models/type';
import { expandEventItem } from '../animations/animations';

@Component({
  selector: 'en-item-event[event]',
  template: `
    <li class="group hover:cursor-pointer " (click)="toggleOpen()">
      <ng-container *ngIf="!isOpen; else elseTemplate">
        <div class="relative h-16 overflow-hidden rounded-lg bg-gradient-to-r from-primary-65 to-primary-0 xs:h-20">
          <p class="center absolute inset-0 z-10 hidden text-white group-hover:flex group-hover:backdrop-blur-[2px]">
            APRI
          </p>
          <img
            [src]="event.imageUrl"
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
            <div class="flex shrink grow-1 flex-col justify-center text-black">
              <p class="truncate text-xl font-bold xs:text-3xl xs:font-extrabold">{{ event.name }}</p>
              <p class="truncate text-lg font-medium xs:text-base xs:font-semibold">
                {{ dateFormatted }} ({{ event.place }})
              </p>
            </div>
            <div class="center absolute right-0 top-0 bottom-0 p-2 text-xl font-black xs:text-3xl">
              <p>{{ maxPersonFormatted }}</p>
            </div>
          </div>
        </div>
      </ng-container>
      <ng-template #elseTemplate>
        <div class="relative h-16 rounded-lg xs:h-20">
          <p class="center absolute inset-0 z-10 text-white backdrop-blur-[2px]">CHIUDI</p>
          <img
            [src]="event.imageUrl"
            [alt]="dateFormatted + '_image'"
            class="center relative h-full w-full object-cover" />
        </div>
      </ng-template>
      <div [@expandEventItem] *ngIf="isOpen" class="mt-2 overflow-hidden rounded bg-primary-95 p-2 text-black ">
        <ul class="divide-y divide-primary-85">
          <li *ngFor="let info of eventInfo" class="flex px-2 py-1">
            <div
              class="flex shrink-0 basis-32 items-center justify-start whitespace-normal break-all font-extrabold text-primary-50">
              {{ info.label }}:
            </div>
            <div class="shrink">{{ info.value }}</div>
          </li>
        </ul>
        <ul class="mt-4 flex gap-4">
          <li
            *ngFor="let icon of itemNavigationMenu"
            [routerLink]="icon.link"
            class="flex grow flex-col items-center rounded-md bg-primary-65 p-1 text-white">
            <a><fa-icon [icon]="icon.definition"></fa-icon></a>
            <span class="text-xs sm:text-sm">{{ icon.name }}</span>
          </li>
        </ul>
        <button
          type="button"
          class="mt-2 inline-block w-full rounded bg-red-600 px-6 py-2.5 text-xs font-extrabold uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg">
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
  animations: [expandEventItem]
})
export class EnItemEventComponent {
  @Input() event!: Event;

  /* Props */
  isOpen = false;
  eventInfo: { label: string; value: string }[] = [];
  dateFormatted = '';
  maxPersonFormatted = '';

  /* Menu */
  itemNavigationMenu: IconLink[] = [
    { link: '#', name: 'Tavoli', definition: faWineBottle },
    { link: '#', name: 'Dipendenti', definition: faUsers },
    { link: '#', name: 'Modifica', definition: faPen }
  ];

  constructor(private datePipe: DatePipe) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event']) {
      this.dateFormatted = this.datePipe.transform(this.event.date, 'dd/MM/yyyy') || '';
      this.maxPersonFormatted = `0/${this.event.maxPerson}`;
      this.eventInfo.push({ label: 'Nome', value: this.event.name });
      this.eventInfo.push({ label: 'Data', value: this.dateFormatted });
      this.eventInfo.push({ label: 'Paganti', value: this.maxPersonFormatted });
      this.eventInfo.push({ label: 'Orario', value: `${this.event.timeStart} - ${this.event.timeEnd}` });
      this.eventInfo.push({ label: 'Lougo', value: this.event.place });
      this.eventInfo.push({ label: 'Ospite/i', value: this.event.guest });
      this.eventInfo.push({ label: 'Descrizione', value: this.event.description });
      this.eventInfo.push({ label: 'Messaggio', value: this.event.messageText });
    }
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }
}

// name: string;
// date: Date;
// timeStart: Date;
// timeEnd: Date;
// maxPerson: number;
// place: string;
// guest: string;
// description: string;
// messageText: string;
// createdAt: Date;
// modificatedAt: Date;
