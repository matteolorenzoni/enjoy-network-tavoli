import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { EmployeeAssignment } from '../models/type';
import { AssignmentService } from '../services/assignment.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'en-item-pr-active[ae]',
  template: `
    <li class="flex items-center gap-4 rounded py-4 px-4 text-slate-300">
      <input
        #checkBoxInput
        id="orange-checkbox"
        type="checkbox"
        class="h-4 w-4 rounded border-primary-50 bg-primary-50 text-black accent-primary-50 ring-offset-primary-40 hover:cursor-pointer focus:ring-2 focus:ring-orange-600 disabled:cursor-not-allowed xs:mr-8"
        [checked]="ae.assignment"
        [disabled]="ae.assignment && ae.assignment.props.personMarked > 0"
        (change)="onChangeCheck($event)" />
      <div class="shrink-0 basis-40 truncate xs:basis-48">
        {{ ae.employee.props.name }} {{ ae.employee.props.lastName }}
      </div>
      <div class="grow truncate">{{ ae.employee.props.zone }}</div>
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
  @Input() ae!: EmployeeAssignment;
  @ViewChild('checkBoxInput') checkBoxInput!: ElementRef<HTMLInputElement>;

  /* Event */
  eventUid: string | null = null;

  /* ------------------------------ Constructor ------------------------------ */
  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private toastService: ToastService
  ) {}

  /* ------------------------------ Lifecycle Hooks ------------------------------ */
  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');
  }

  /* ------------------------------ Methods ------------------------------ */
  onChangeCheck(event: Event): void {
    if (!this.eventUid) {
      throw new Error('Errore: parametri non validi');
    }

    const { checked } = event.target as HTMLInputElement;
    if (checked) {
      this.addAssignment(this.eventUid, this.ae.employee.uid);
    } else if (this.ae.assignment) {
      this.deleteAssignment(this.ae.assignment.uid);
    }
  }

  public async addAssignment(eventUid: string, employeeUid: string) {
    try {
      await this.assignmentService.addAssignment(eventUid, employeeUid);
      this.toastService.showSuccess(`Ora ${this.ae.employee.props.name} può inviare tickets`);
    } catch (error: any) {
      this.toastService.showError(error);
    }
  }

  public async deleteAssignment(assignmentUid: string) {
    try {
      const text = "Sei sicuro di voler rimuovere l'assegnazione?";
      if (window.confirm(text) === true) {
        await this.assignmentService.updateAssignmentIsActive(assignmentUid, false);
        this.toastService.showSuccess(`Ora ${this.ae.employee.props.name} non può più inviare tickets`);
      } else {
        this.checkBoxInput.nativeElement.checked = true;
      }
    } catch (error: any) {
      this.toastService.showError(error);
    }
  }
}
