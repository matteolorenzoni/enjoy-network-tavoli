import { Component, Input, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faUserPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from '../services/toast.service';
import { Table } from '../models/type';
import { ParticipationService } from '../services/participation.service';
import { TableService } from '../services/table.service';

@Component({
  selector: 'en-item-table[table][canAddClient]',
  template: `
    <li
      role="button"
      class="group flex h-16 items-center rounded-lg p-2 hover:cursor-pointer active:bg-slate-900"
      (click)="goToClient()">
      <div class="overflow-hidden">
        <p class="truncate text-slate-300">{{ table.props.name }}</p>
      </div>
      <div class="ml-auto flex-none shrink-0 basis-16 pl-2">
        <p class="m-auto rounded-xl bg-neutral py-1 px-4 text-center text-slate-300">
          {{ tableParticipation }}
        </p>
      </div>
      <div class="flex h-full flex-none shrink-0 basis-16 items-center justify-evenly hover:cursor-default">
        <fa-icon
          [icon]="updateIcon"
          role="button"
          class="ml-2 text-slate-300 transition duration-150 ease-in-out hover:cursor-pointer active:scale-90 active:text-slate-500"
          (click)="updateTable($event)"></fa-icon>
        <fa-icon
          [icon]="deleteIcon"
          role="button"
          class="ml-2 text-slate-300 transition duration-150 ease-in-out hover:cursor-pointer active:scale-90 active:text-slate-500"
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
  @Input() canAddClient!: boolean;

  /* Event */
  eventUid: string | null = null;

  /* Participation */
  tableParticipation = 0;

  /* Icons */
  addIcon = faUserPlus;
  updateIcon = faPen;
  deleteIcon = faTrash;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tableService: TableService,
    private participationService: ParticipationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['table']) {
      this.getTablePersonMarked();
    }
  }

  goToClient(): void {
    this.router.navigate([`./${this.table.uid}/participations`], {
      relativeTo: this.route,
      queryParams: { canAddClient: this.canAddClient }
    });
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

  getTablePersonMarked(): void {
    this.participationService
      .getParticipationsCountByTableUid(this.table.uid)
      .then((count) => {
        this.tableParticipation = count;
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }
}
