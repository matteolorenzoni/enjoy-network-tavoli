import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faUserPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Table } from '../models/type';

@Component({
  selector: 'en-item-table[eventUid][table][deleteTableEvent]',
  template: `
    <li class="flex h-16 items-center">
      <div class="overflow-hidden">
        <p class="truncate">{{ table.tableDTO.name }}</p>
      </div>
      <div class="ml-auto flex-none shrink-0 basis-16 pl-2">
        <p class="m-auto rounded-xl bg-neutral py-1 px-4 text-center">
          {{ table.tableDTO.personMarked }}/{{ table.tableDTO.personAssigned }}
        </p>
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
          (click)="deletTable()"></fa-icon>
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

  /* Icons */
  addIcon = faUserPlus;
  updateIcon = faPen;
  deleteIcon = faTrash;

  constructor(private router: Router, private route: ActivatedRoute) {}

  goToClient(): void {
    this.router.navigate([`./table/${this.table.uid}`], { relativeTo: this.route });
  }

  updateTable(): void {
    this.router.navigate([`create-item/${this.eventUid}/table/${this.table.uid}`]);
  }

  deletTable(): void {
    this.deleteTableEvent.emit(this.table.uid);
  }
}
