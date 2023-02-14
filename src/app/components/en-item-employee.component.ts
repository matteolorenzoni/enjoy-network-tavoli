import { Component, Input, SimpleChanges } from '@angular/core';
import { faCircleCheck, faCircleXmark, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { EmployeeDTO } from '../models/collection';
import { Employee } from '../models/type';
import { EmployeeService } from '../services/employee.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'en-item-employee[employee]',
  template: `
    <li class="flex h-14 items-center gap-2">
      <ng-container *ngIf="employeeProps.isActive; else elseTemplate">
        <fa-icon [icon]="activeIcon" class="text-emerald-600"></fa-icon>
      </ng-container>
      <ng-template #elseTemplate>
        <fa-icon [icon]="notActiveIcon" class="text-red-600"></fa-icon>
      </ng-template>
      <div class="center mx-2 w-full shrink-0 basis-20 rounded bg-primary-60/70 text-white">
        {{ employeeProps.role | uppercase | slice: 0:5 }}
      </div>
      <div class="shrink truncate text-white">{{ employeeProps.name }} {{ employeeProps.lastName }}</div>
      <div class="ml-auto shrink-0 px-1">
        <fa-icon
          [icon]="modifyIcon"
          class="mr-2 text-gray-500  hover:cursor-pointer hover:text-gray-600 active:text-gray-800"
          [routerLink]="['/create-item/employee', employeeUid]"></fa-icon>
        <fa-icon
          [icon]="deleteIcon"
          class="ml-2 text-gray-500 hover:cursor-pointer hover:text-gray-600 active:text-gray-800"
          (click)="deleteEmployee()"></fa-icon>
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
export class EnItemEmployeeComponent {
  @Input() employee!: Employee;

  /* Icons */
  activeIcon = faCircleCheck;
  notActiveIcon = faCircleXmark;
  modifyIcon = faPen;
  deleteIcon = faTrash;

  // TODO: capire se questa parte si puo rimuovere e restituire direttamente il valore
  /* Employee */
  employeeUid = '';
  employeeProps!: EmployeeDTO;

  constructor(private employeeService: EmployeeService, private toastService: ToastService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee']) {
      this.employeeUid = this.employee.uid;
      this.employeeProps = this.employee.props;
    }
  }

  deleteEmployee(): void {
    const text = 'Sei sicuro di voler eliminare questo dipendente?';
    if (window.confirm(text) === true) {
      if (!this.employeeUid) {
        throw new Error('Errore: parametri non validi');
      }

      this.employeeService
        .deleteEmployee(this.employeeUid)
        .then(() => {
          this.toastService.showSuccess('Dipendente eliminato');
        })
        .catch((err: Error) => {
          this.toastService.showError(err);
        });
    }
  }
}
