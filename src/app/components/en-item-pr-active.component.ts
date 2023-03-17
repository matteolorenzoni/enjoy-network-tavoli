import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Employee } from '../models/type';
import { AssignmentService } from '../services/assignment.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'en-item-pr-active[employee]',
  template: `
    <li class="flex items-center gap-4 rounded py-4 px-4 text-slate-300">
      <div class="shrink-0 basis-40 truncate xs:basis-48">{{ employee.props.name }} {{ employee.props.lastName }}</div>
      <div class="grow truncate">{{ employee.props.zone }}</div>
      <fa-icon
        [icon]="addIcon"
        role="button"
        class="text-xl transition duration-150 ease-in-out hover:cursor-pointer active:scale-90 active:text-slate-500"
        (click)="addAssignment(employee.uid)"></fa-icon>
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
  @Output() removeEmployeeDeletedEvent = new EventEmitter<string>();
  @ViewChild('checkBoxInput') checkBoxInput!: ElementRef<HTMLInputElement>;

  /* Icon */
  addIcon = faPlus;

  /* Event */
  eventUid?: string;

  /* ------------------------------ Constructor ------------------------------ */
  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private toastService: ToastService
  ) {}

  /* ------------------------------ Lifecycle Hooks ------------------------------ */
  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid') || undefined;
  }

  /* ------------------------------ HTTP Methods ------------------------------ */
  public async addAssignment(employeeUid: string) {
    if (!this.eventUid) {
      this.toastService.showErrorMessage("Errore, parametri dell'evento non validi");
      return;
    }

    try {
      await this.assignmentService.addAssignment(this.eventUid, employeeUid);
      this.removeEmployeeDeletedEvent.emit(employeeUid);
      this.toastService.showSuccess(`Ora ${this.employee.props.name} può inviare tickets`);
    } catch (error: any) {
      this.toastService.showError(error);
    }
  }
}
