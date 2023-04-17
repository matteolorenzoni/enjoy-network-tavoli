/* eslint-disable operator-linebreak */
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faCircleMinus, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, Subscription } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AssignmentService } from '../services/assignment.service';
import { EmployeeAssignment } from '../models/type';

@Component({
  selector: 'en-item-assignment[ea][eventMaxPerson]',
  template: ` <li class="flex flex-nowrap items-center rounded-md py-4 text-slate-300">
    <div class="grow-2 basis-40 truncate sm:w-max">{{ ea.employee.props.name }} {{ ea.employee.props.lastName }}</div>
    <div class="hidden grow basis-20 text-sm sm:flex sm:basis-24">{{ ea.employee.props.zone | uppercase }}</div>
    <div class="flex basis-36 justify-end gap-1 ">
      <div class="center mr-1">
        {{ ea.assignment?.props?.personMarked }}/{{ ea.assignment?.props?.maxPersonMarkable }}
      </div>
      <div class="center relative flex h-6 w-24 flex-row rounded-lg bg-transparent text-black">
        <button
          data-action="decrement"
          class="center h-full w-20 rounded-l bg-primary-60 outline-none  active:bg-primary-40 enabled:cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200 "
          (click)="decreasePersonAssigned()"
          [disabled]="ea.assignment && !ea.assignment.props.isActive">
          <span class="">−</span>
        </button>
        <input
          type="number"
          pattern="d*"
          class="flex w-full items-center rounded-none bg-primary-65 text-center font-semibold outline-none focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 "
          [formControl]="formPersonAssigned" />
        <button
          data-action="increment"
          class="center h-full w-20 cursor-pointer rounded-r bg-primary-60 outline-none active:bg-primary-40 disabled:cursor-not-allowed disabled:bg-gray-200"
          (click)="incrementPersonAssigned()"
          [disabled]="ea.assignment && !ea.assignment.props.isActive">
          <span class="m">+</span>
        </button>
      </div>
    </div>
    <label class="relative ml-2 inline-flex cursor-pointer items-center">
      <input type="checkbox" [formControl]="formIsActive" class="peer sr-only" />
      <div
        class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-60 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-0"></div>
    </label>
  </li>`,
  styles: [
    `
      :host {
        display: block;
      }

      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    `
  ]
})
export class EnItemAssignmentComponent {
  @Input() ea!: EmployeeAssignment;
  @Input() eventMaxPerson!: number;

  /* Icons */
  incrementIcon = faCirclePlus;
  decrementIcon = faCircleMinus;

  /* Form */
  formPersonAssigned = new FormControl<number>(0, { nonNullable: true });
  formIsActive = new FormControl<boolean>(true, { nonNullable: true });

  /* Subscriptions */
  subPersonAssigned!: Subscription;
  assignmentIsActive!: Subscription;

  constructor(private assignmentService: AssignmentService, private toastService: ToastService) {}

  /* ----------------------------------------------------- lifecycle hooks ----------------------------------------------------- */

  ngOnInit(): void {
    /* Form PersonAssigned */
    this.subPersonAssigned = this.formPersonAssigned.valueChanges
      .pipe(debounceTime(1200))
      .subscribe((newPersonAssigned) => {
        if (!this.ea.assignment) return;

        /* Check if the value is different from the previous one */
        if (this.ea.assignment.props.maxPersonMarkable === newPersonAssigned) return;

        if (!newPersonAssigned) {
          this.formPersonAssigned.setValue(this.ea.assignment.props.maxPersonMarkable);
          this.toastService.showErrorMessage('Il valore deve essere un numero');
          return;
        }

        if (newPersonAssigned < this.ea.assignment.props.personMarked) {
          this.formPersonAssigned.setValue(this.ea.assignment.props.maxPersonMarkable);
          this.toastService.showErrorMessage(
            newPersonAssigned < 0
              ? 'Il valore non può essere negativo'
              : 'Il valore non può essere inferiore al numero di persone che hanno già ricevuto il ticket'
          );
          return;
        }

        /* Check if the value is less than the max person */
        const hypotheticalPersonAssigned =
          this.ea.assignment.props.maxPersonMarkable + newPersonAssigned - this.ea.assignment.props.maxPersonMarkable;
        if (hypotheticalPersonAssigned <= this.eventMaxPerson) {
          /* Update the value */
          this.assignmentService
            .updateAssignmentPersonAssignedProp(this.ea.assignment.uid, newPersonAssigned)
            .then(() => {
              this.toastService.showSuccess('Elemento modificato');
            })
            .catch((err: Error) => {
              this.toastService.showError(err);
            });
        } else {
          /* Reset the value */
          this.formPersonAssigned.setValue(this.ea.assignment.props.maxPersonMarkable);
          this.toastService.showErrorMessage('Non puoi assegnare più persone di quelle disponibili');
        }
      });

    /* Form IsActive */
    this.assignmentIsActive = this.formIsActive.valueChanges.subscribe(async (value) => {
      try {
        if (!this.ea.assignment) return;

        await this.assignmentService.updateAssignmentIsActive(this.ea.assignment.uid, value);
        this.toastService.showSuccess(
          this.ea.assignment.props.personMarked > 0 ? 'Assegnamento modificato' : 'Assegnamento eliminato'
        );
      } catch (error: any) {
        this.toastService.showError(error);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ea']) {
      if (this.ea.assignment) {
        /* Form PersonAssigned */
        this.formPersonAssigned.setValue(this.ea.assignment.props.maxPersonMarkable);
        if (!this.ea.assignment.props.isActive) {
          this.formPersonAssigned.disable();
        }

        /* Form IsActive */
        this.formIsActive.setValue(this.ea.assignment.props.isActive);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subPersonAssigned) this.subPersonAssigned.unsubscribe();
    if (this.assignmentIsActive) this.assignmentIsActive.unsubscribe();
  }

  /* ----------------------------------------------------- methods ----------------------------------------------------- */
  decreasePersonAssigned() {
    this.formPersonAssigned.setValue(this.formPersonAssigned.value - 1);
  }

  incrementPersonAssigned() {
    this.formPersonAssigned.setValue(this.formPersonAssigned.value + 1);
  }
}
