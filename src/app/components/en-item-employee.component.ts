import { Component, Input, SimpleChanges } from '@angular/core';
import {
  faCircleCheck,
  faCircleXmark,
  faCrown,
  faMagnifyingGlass,
  faPen,
  faTrash,
  faUserTie,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { RoleType } from 'src/app/models/enum';
import { Employee } from '../models/type';
import { EmployeeService } from '../services/employee.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'en-item-employee[employee]',
  template: `
    <li class="flex h-14 items-center gap-2 text-slate-300">
      <ng-container *ngIf="employee.props.isActive; else elseTemplate">
        <fa-icon [icon]="activeIcon" class="text-emerald-600"></fa-icon>
      </ng-container>
      <ng-template #elseTemplate>
        <fa-icon [icon]="notActiveIcon" class="text-red-600"></fa-icon>
      </ng-template>
      <div class="center mx-2 w-full shrink-0 basis-20 rounded bg-slate-800 text-white">
        <fa-icon [icon]="employeeRoleIcon"></fa-icon>
      </div>
      <div class="shrink truncate">{{ employee.props.name }} {{ employee.props.lastName }}</div>
      <div class="ml-auto flex shrink-0 gap-4 px-1">
        <fa-icon
          [icon]="modifyIcon"
          role="button"
          class="transition active:text-slate-500"
          [routerLink]="['./', employee.uid]"></fa-icon>
        <fa-icon
          [icon]="deleteIcon"
          role="button"
          class="transition active:text-slate-500"
          (click)="deleteEmployee($event)"></fa-icon>
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
  adminIcon = faCrown;
  employeeIcon = faUserTie;
  inspectorIcon = faMagnifyingGlass;

  /* Employee */
  employeeRoleIcon!: IconDefinition;

  constructor(private employeeService: EmployeeService, private toastService: ToastService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee']) {
      switch (this.employee.props.role) {
        case RoleType.ADMINISTRATOR:
          this.employeeRoleIcon = this.adminIcon;
          break;
        case RoleType.PR:
          this.employeeRoleIcon = this.employeeIcon;
          break;
        default:
          this.employeeRoleIcon = this.inspectorIcon;
          break;
      }
    }
  }

  deleteEmployee(e: Event): void {
    e.stopPropagation();

    const text = 'Sei sicuro di voler eliminare questo dipendente?';
    if (window.confirm(text) === true) {
      if (!this.employee) {
        throw new Error('Parametri non validi');
      }

      this.employeeService
        .deleteEmployee(this.employee.uid)
        .then(() => {
          this.toastService.showSuccess('Dipendente eliminato');
        })
        .catch((err: Error) => {
          this.toastService.showError(err);
        });
    }
  }
}
