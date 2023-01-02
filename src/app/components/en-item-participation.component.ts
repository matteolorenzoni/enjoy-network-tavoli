import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PartecipationAndClient } from '../models/type';

@Component({
  selector: 'en-item-participation[pc][payedChangeEvent]',
  template: `
    <li class="flex h-12 items-center">
      <div class="mr-4 flex">
        <div>{{ isActive ? '🟠' : '⚪' }}</div>
        <div>{{ hasPayed ? '🟠' : '⚪' }}</div>
        <div>{{ hasScanned ? '🟠' : '⚪' }}</div>
      </div>
      <div>
        <p>{{ pc.client.clientDTO.name }} {{ pc.client.clientDTO.lastName }}</p>
      </div>
      <div class="ml-auto flex items-center">
        <label class="relative ml-2 inline-flex cursor-pointer items-center">
          <input type="checkbox" [formControl]="formIsActive" class="peer sr-only" />
          <div
            class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-60 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-0"></div>
        </label>
      </div>
      <div>
        <fa-icon
          [icon]="deleteIcon"
          class="ml-4 text-lg text-gray-500 hover:cursor-pointer hover:text-gray-300 active:text-gray-800"
          (click)="deleteParticipation()"></fa-icon>
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
  @Input() pc!: PartecipationAndClient;
  @Output() payedChangeEvent = new EventEmitter<{ partecipationUid: string; hasPayed: boolean }>();

  /* Icons */
  deleteIcon = faTrash;

  /* Participation */
  isActive = false;
  hasPayed = false;
  hasScanned = false;

  /* Form */
  formIsActive = new FormControl<boolean>(this.hasPayed, { nonNullable: true });

  /* Subscriptions */
  subIsActive!: Subscription;

  /* ------------------------------ Constructor ------------------------------ */
  constructor() {
    this.subIsActive = this.formIsActive.valueChanges.subscribe((value) => {
      if (value === this.hasPayed) return;

      this.updatePayement(value);
    });
  }

  /* ------------------------------ LifeCycle ------------------------------ */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pc']) {
      const currentValue = changes['pc'].currentValue as PartecipationAndClient;
      this.isActive = currentValue.participation.participationDTO.active;
      this.hasPayed = currentValue.participation.participationDTO.payed;
      this.hasScanned = currentValue.participation.participationDTO.scanned;

      /* Form IsActive */
      this.formIsActive.setValue(this.hasPayed);
    }
  }

  ngOnDestroy(): void {
    if (this.subIsActive) this.subIsActive.unsubscribe();
  }

  /* ------------------------------ Methods ------------------------------ */
  updatePayement(clientHasPayed: boolean): void {
    this.payedChangeEvent.emit({ partecipationUid: this.pc.participation.uid, hasPayed: clientHasPayed });
  }

  deleteParticipation(): void {
    console.log('deleteParticipation');
  }
}
