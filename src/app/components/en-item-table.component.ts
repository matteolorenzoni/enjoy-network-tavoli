import { Employee } from 'src/app/models/type';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faUserPlus, faPen, faTrash, faCrown } from '@fortawesome/free-solid-svg-icons';
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
      class="group flex w-full items-center justify-between gap-4 overflow-hidden rounded-lg py-4 active:scale-[.98]"
      (click)="goToClient()">
      <div class="flex grow flex-col truncate sm:flex-row sm:items-center sm:gap-4">
        <p class="truncate text-slate-300">
          <fa-icon *ngIf="isFidelityTable" class="mr-1 text-yellow-500" [icon]="crownIcon"></fa-icon>
          {{ table.props.name }}
        </p>
        <p *ngIf="employeeIsAdmin" class="truncate text-[10px] text-slate-400 sm:text-sm">
          {{ employeeOwnTable?.props?.name }} {{ employeeOwnTable?.props?.lastName }}
        </p>
      </div>
      <div class="h-full shrink-0">
        <p class="center m-auto h-full rounded-lg bg-neutral px-5 py-3 text-center text-slate-300">
          {{ table.props.personsActive }}
        </p>
      </div>
      <div class="flex h-full shrink-0 items-center justify-center gap-4">
        <fa-icon
          [icon]="updateIcon"
          role="button"
          class="text-slate-300 active:text-slate-500"
          (click)="updateTable($event)"></fa-icon>
        <fa-icon
          [icon]="deleteIcon"
          role="button"
          class="text-slate-300 active:text-slate-500"
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
  employeeIsAdmin = false;

  /* Event */
  eventUid? = '';

  /* Table */
  employeeOwnTable?: Employee;
  isFidelityTable = false;

  /* Icons */
  addIcon = faUserPlus;
  updateIcon = faPen;
  deleteIcon = faTrash;
  crownIcon = faCrown;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private employeeService: EmployeeService,
    private tableService: TableService,
    private toastService: ToastService
  ) {
    this.employeeUid = this.userService.getUserUid();
    this.employeeIsAdmin = environment.administratorUids.includes(this.employeeUid);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['table']) {
      this.isFidelityTable = environment.fidelityTables.includes(this.table.uid);
    }
  }

  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid') || undefined;

    if (this.employeeIsAdmin) {
      this.employeeService
        .getEmployee(this.table.props.employeeUid)
        .then((employee) => {
          this.employeeOwnTable = employee;
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
        throw new Error('Parametri non validi');
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
