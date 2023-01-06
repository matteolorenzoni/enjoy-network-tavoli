import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faUserPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from '../services/toast.service';
import { Table } from '../models/type';
import { ParticipationService } from '../services/participation.service';

@Component({
  selector: 'en-item-table[eventUid][table][deleteTableEvent]',
  template: `
    <li class="flex h-16 items-center">
      <div class="overflow-hidden">
        <p class="truncate">{{ table.props.name }}</p>
      </div>
      <div class="ml-auto flex-none shrink-0 basis-16 pl-2">
        <p class="m-auto rounded-xl bg-neutral py-1 px-4 text-center">{{ tableParticipation }}</p>
      </div>
      <div class="flex flex-none shrink-0 basis-24 justify-end gap-1">
        <fa-icon
          [icon]="addIcon"
          class="ml-2 text-gray-500 hover:cursor-pointer hover:text-gray-300 active:text-gray-800"
          (click)="goToClient()"></fa-icon>
        <fa-icon
          [icon]="updateIcon"
          class="ml-2 text-gray-500 hover:cursor-pointer hover:text-gray-300 active:text-gray-800"
          (click)="updateTable()"></fa-icon>
        <fa-icon
          [icon]="deleteIcon"
          class="ml-2 text-gray-500 hover:cursor-pointer hover:text-gray-300 active:text-gray-800"
          (click)="deleteTable()"></fa-icon>
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
  @Input() eventUid!: string | null;
  @Output() deleteTableEvent = new EventEmitter<string>();

  /* Participation */
  tableParticipation = 0;

  /* Icons */
  addIcon = faUserPlus;
  updateIcon = faPen;
  deleteIcon = faTrash;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private participationService: ParticipationService,
    private toastService: ToastService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['table']) {
      this.getTablePersonMarked();
    }
  }

  goToClient(): void {
    this.router.navigate([`./table/${this.table.uid}`], { relativeTo: this.route });
  }

  updateTable(): void {
    this.router.navigate([`create-item/${this.eventUid}/table/${this.table.uid}`]);
  }

  deleteTable(): void {
    this.deleteTableEvent.emit(this.table.uid);
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
