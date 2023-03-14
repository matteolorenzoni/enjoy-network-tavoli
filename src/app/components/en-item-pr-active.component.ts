import { ActivatedRoute } from '@angular/router';
import { Component, Input } from '@angular/core';
import { AssignmentAndEmployee } from '../models/type';
import { AssignmentService } from '../services/assignment.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'en-item-pr-active[ae]',
  template: `
    <li class="flex items-center gap-4 rounded py-4 px-4 text-slate-300">
      <input
        id="orange-checkbox"
        type="checkbox"
        class="h-4 w-4 rounded border-primary-50 bg-primary-50 text-black accent-primary-50 ring-offset-primary-40 hover:cursor-pointer focus:ring-2 focus:ring-orange-600 disabled:cursor-not-allowed xs:mr-8"
        [checked]="ae.assignment.props.isActive"
        [disabled]="ae.assignment.props.personMarked > 0"
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
  @Input() ae!: AssignmentAndEmployee;

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
    } else {
      this.deleteAssignment(this.eventUid, this.ae.employee.uid);
    }
  }

  public async addAssignment(eventUid: string, employeeUid: string) {
    await this.assignmentService
      .addAssignment(eventUid, employeeUid)
      .then(() => {
        this.toastService.showSuccess(
          `Ora ${this.ae.employee.props.name} ${this.ae.employee.props.lastName} può inviare tickets`
        );
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });
  }

  public async deleteAssignment(eventUid: string, employeeUid: string) {
    const text = "Sei sicuro di voler rimuovere l'assegnazione?";
    if (window.confirm(text) === true) {
      if (!eventUid || !employeeUid) {
        throw new Error('Errore: parametri non validi');
      }

      await this.assignmentService
        .deleteAssignment(eventUid, employeeUid)
        .then(() => {
          this.toastService.showSuccess('Dipendente rimosso');
        })
        .catch((err: Error) => {
          this.toastService.showError(err);
        });
    }
  }
}
