/* eslint-disable operator-linebreak */
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faCircleMinus, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, Subscription } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AssignmentService } from '../services/assignment.service';
import { AssignmentAndEmployee } from '../models/type';

@Component({
  selector: 'en-item-assignment[ae][maxPerson]',
  template: ` <li class="my-2 flex h-12 flex-nowrap items-center">
    <div class="grow-2 basis-40 truncate sm:w-max">{{ ae.employee.props.name }} {{ ae.employee.props.lastName }}</div>
    <div class="hidden grow basis-20 text-sm sm:flex sm:basis-24">{{ ae.employee.props.zone | uppercase }}</div>
    <div class="flex basis-36 justify-end gap-1 ">
      <div class="center mr-1">{{ ae.assignment.props.personMarked }}/{{ ae.assignment.props.personAssigned }}</div>
      <div class="center relative flex h-6 w-24 flex-row rounded-lg bg-transparent">
        <button
          data-action="decrement"
          class="center h-full w-20 rounded-l bg-primary-60 text-black outline-none hover:bg-primary-50 active:bg-primary-40 enabled:cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200 "
          (click)="decreasePersonAssigned()"
          [disabled]="!ae.assignment.props.isActive">
          <span class="">−</span>
        </button>
        <input
          type="number"
          pattern="d*"
          class="flex w-full items-center rounded-none bg-primary-65 text-center font-semibold text-black outline-none hover:bg-primary-60 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 "
          [formControl]="formPersonAssigned" />
        <button
          data-action="increment"
          class="center h-full w-20 cursor-pointer rounded-r bg-primary-60 text-black outline-none hover:bg-primary-50 active:bg-primary-40 active:text-white disabled:cursor-not-allowed disabled:bg-gray-200"
          (click)="incrementPersonAssigned()"
          [disabled]="!ae.assignment.props.isActive">
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
  @Input() ae!: AssignmentAndEmployee;
  @Input() maxPerson!: number;

  /* Icons */
  incrementIcon = faCirclePlus;
  decrementIcon = faCircleMinus;

  /* Form */
  formPersonAssigned = new FormControl<number>(0, { nonNullable: true });
  formIsActive = new FormControl<boolean>(true, { nonNullable: true });

  /* Subscriptions */
  subPersonAssigned!: Subscription;
  subIsActive!: Subscription;

  constructor(private assignmentService: AssignmentService, private toastService: ToastService) {}

  /* ----------------------------------------------------- lifecycle hooks ----------------------------------------------------- */

  ngOnInit(): void {
    /* Form PersonAssigned */
    this.subPersonAssigned = this.formPersonAssigned.valueChanges
      .pipe(debounceTime(1200))
      .subscribe((newPersonAssigned) => {
        /* Check if the value is different from the previous one */
        if (this.ae.assignment.props.personAssigned !== newPersonAssigned) {
          /* Check if the value is less than the max person */
          const hypotheticalPersonAssigned =
            this.ae.assignment.props.personAssigned + newPersonAssigned - this.ae.assignment.props.personAssigned;
          if (hypotheticalPersonAssigned <= this.maxPerson) {
            /* Update the value */
            this.assignmentService
              .updateAssignmentPersonAssignedProp(this.ae.assignment.uid, newPersonAssigned)
              .then(() => {
                this.toastService.showSuccess('Elemento modificato');
              })
              .catch((err: Error) => {
                this.toastService.showError(err);
              });
          } else {
            /* Reset the value */
            this.formPersonAssigned.setValue(this.ae.assignment.props.personAssigned);
            this.toastService.showErrorMessage('Non puoi assegnare più persone di quelle disponibili');
          }
        }
      });

    /* Form IsActive */
    this.subIsActive = this.formIsActive.valueChanges.subscribe((value) => {
      this.assignmentService
        .updateAssignmentIsActive(this.ae.assignment.uid, this.ae.assignment.props.personMarked, value)
        .then(() => {
          this.toastService.showSuccess(
            this.ae.assignment.props.personMarked ? 'Elemento modificato' : 'Elemento eliminato'
          );
        })
        .catch((err: Error) => {
          this.toastService.showError(err);
        });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ae']) {
      /* Form PersonAssigned */
      this.formPersonAssigned.setValue(this.ae.assignment.props.personAssigned);
      if (!this.ae.assignment.props.isActive) {
        this.formPersonAssigned.disable();
      }

      /* Form IsActive */
      this.formIsActive.setValue(this.ae.assignment.props.isActive);
    }
  }

  ngOnDestroy(): void {
    if (this.subPersonAssigned) this.subPersonAssigned.unsubscribe();
    if (this.subIsActive) this.subIsActive.unsubscribe();
  }

  /* ----------------------------------------------------- methods ----------------------------------------------------- */
  decreasePersonAssigned() {
    this.formPersonAssigned.setValue(this.formPersonAssigned.value - 1);
  }

  incrementPersonAssigned() {
    this.formPersonAssigned.setValue(this.formPersonAssigned.value + 1);
  }
}
