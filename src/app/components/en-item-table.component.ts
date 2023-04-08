import { Employee } from 'src/app/models/type';
import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faUserPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import { EmployeeService } from '../services/employee.service';
import { ToastService } from '../services/toast.service';
import { Table } from '../models/type';
import { TableService } from '../services/table.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'en-item-table[table]',
  template: `
    <li
      role="button"
      class="group flex h-16 w-full items-center justify-between gap-4 overflow-hidden rounded-lg p-2 hover:cursor-pointer active:bg-slate-900"
      (click)="goToClient()">
      <div class="flex grow flex-col truncate sm:flex-row sm:items-center sm:gap-4">
        <p class="truncate text-slate-300">{{ table.props.name }}</p>
        <p *ngIf="employeeIsAdministrator && tableEmployee" class="text-[10px] text-slate-400 sm:text-sm">
          {{ tableEmployee.props.name }} {{ tableEmployee.props.lastName }}
        </p>
      </div>
      <div class="h-full shrink-0">
        <p class="center m-auto h-full rounded-lg bg-neutral px-6 text-center text-slate-300">
          {{ table.props.personsActive }}
        </p>
      </div>
      <div class="flex h-full shrink-0 items-center justify-center gap-4">
        <fa-icon
          [icon]="updateIcon"
          role="button"
          class="text-slate-300 transition duration-150 ease-in-out hover:cursor-pointer active:scale-90 active:text-slate-500"
          (click)="updateTable($event)"></fa-icon>
        <fa-icon
          [icon]="deleteIcon"
          role="button"
          class="text-slate-300 transition duration-150 ease-in-out hover:cursor-pointer active:scale-90 active:text-slate-500"
          (click)="deleteTable($event)"></fa-icon>
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
export class EnItemTableComponent {
  @Input() table!: Table;

  /* Employee */
  employeeUid = '';
  administratorUids: string[] = [];
  employeeIsAdministrator = false;

  /* Event */
  eventUid: string | null = null;

  /* Table */
  tableEmployee?: Employee;

  /* Icons */
  addIcon = faUserPlus;
  updateIcon = faPen;
  deleteIcon = faTrash;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private employeeService: EmployeeService,
    private tableService: TableService,
    private toastService: ToastService
  ) {
    this.employeeUid = this.userService.getUserUid();
    this.administratorUids = environment.administratorUids;
    this.employeeIsAdministrator = this.administratorUids.includes(this.employeeUid);
  }

  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');

    if (this.employeeIsAdministrator) {
      this.employeeService
        .getEmployee(this.table.props.employeeUid)
        .then((employee) => {
          this.tableEmployee = employee;
        })
        .catch((error: Error) => {
          this.toastService.showError(error);
        });
    }
  }

  goToClient(): void {
    this.router.navigate([`./${this.table.uid}/participations`], { relativeTo: this.route });
  }

  updateTable(e: Event): void {
    e.stopPropagation();

    this.router.navigate([`./${this.table.uid}`], { relativeTo: this.route });
  }

  deleteTable(e: Event): void {
    e.stopPropagation();

    const text = 'Sei sicuro di voler rimuovere il tavolo?';
    if (window.confirm(text) === true) {
      if (!this.table) {
        throw new Error('Errore: parametri non validi');
      }

      this.tableService
        .deleteTable(this.table.uid)
        .then(() => {
          this.toastService.showSuccess('Tavolo eliminato con successo');
        })
        .catch((error: Error) => {
          this.toastService.showError(error);
        });
    }
  }
}
