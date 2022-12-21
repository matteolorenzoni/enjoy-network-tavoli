import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../models/type';

@Component({
  selector: 'en-item-pr-active[employee][isChecked][isDisabled][changeCheckEvent]',
  template: `
    <li class="flex h-14 items-center">
      <input
        id="orange-checkbox"
        type="checkbox"
        class="text-balck mr-4 h-4 w-4 rounded border-primary-50 bg-primary-50 accent-primary-50 ring-offset-primary-40 hover:cursor-pointer focus:ring-2 focus:ring-orange-600 disabled:cursor-not-allowed xs:mr-8"
        [checked]="isChecked"
        [disabled]="isDisabled"
        (change)="onChangeCheck($event)" />
      <div class="mr-4 basis-44 truncate xs:mr-8 xs:basis-48">
        {{ employee.employeeDTO.name }} {{ employee.employeeDTO.lastName }}
      </div>
      <div class="truncate">{{ employee.employeeDTO.zone }}</div>
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
export class EnItemPrActiveComponent {
  @Input() employee!: Employee;
  @Input() isChecked!: boolean;
  @Input() isDisabled!: boolean;

  @Output() changeCheckEvent = new EventEmitter<{ checked: boolean; employeeUid: string }>();

  onChangeCheck(event: Event): void {
    this.changeCheckEvent.emit({
      checked: (event.target as HTMLInputElement).checked,
      employeeUid: this.employee.uid
    });
  }
}
