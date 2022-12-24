import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faCircleMinus, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, Subscription } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AssignmentService } from '../services/assignment.service';

@Component({
  selector:
    'en-item-assignment[assUid][assActive][assPersonAssigned][assPersonMarked][empName][empLastName][empZone][currentPersonAssigned][maxPerson]',
  template: ` <li class="my-2 flex h-12 flex-nowrap items-center">
    <div class="grow-2 basis-40 truncate sm:w-max">{{ empName }} {{ empLastName }}</div>
    <div class="hidden grow basis-20 text-sm sm:flex sm:basis-24">{{ empZone | uppercase }}</div>
    <div class="flex basis-36 justify-end gap-1 ">
      <div class="center mr-1">{{ assPersonMarked }}/{{ assPersonAssigned }}</div>
      <div class="center relative flex h-6 w-24 flex-row rounded-lg bg-transparent">
        <button
          data-action="decrement"
          class="center h-full w-20 rounded-l bg-primary-60 text-black outline-none hover:bg-primary-50 active:bg-primary-40 enabled:cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200 "
          (click)="decreasPersonAssigned()"
          [disabled]="!assActive">
          <span class="">−</span>
        </button>
        <input
          type="number"
          class="flex w-full items-center rounded-none bg-primary-65 text-center font-semibold text-black outline-none hover:bg-primary-60 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 "
          [formControl]="formPersonAssigned" />
        <button
          data-action="increment"
          class="center h-full w-20 cursor-pointer rounded-r bg-primary-60 text-black outline-none hover:bg-primary-50 active:bg-primary-40 active:text-white disabled:cursor-not-allowed disabled:bg-gray-200"
          (click)="incrementPersonAssigned()"
          [disabled]="!assActive">
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
  @Input() assUid!: string;
  @Input() assActive!: boolean;
  @Input() assPersonAssigned!: number;
  @Input() assPersonMarked!: number;
  @Input() empName!: string;
  @Input() empLastName!: string;
  @Input() empZone!: string;
  @Input() currentPersonAssigned!: number;
  @Input() maxPerson!: number;

  @Output() refreshAssignmentAndEmployeeArrayEvent = new EventEmitter();

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
        if (this.assPersonAssigned !== newPersonAssigned) {
          /* Check if the value is less than the max person */
          const hipoteticalPersonAssigned = this.currentPersonAssigned + newPersonAssigned - this.assPersonAssigned;
          if (hipoteticalPersonAssigned <= this.maxPerson) {
            /* Update the value */
            this.assignmentService
              .updateAssignmentPersonAssignedProp(this.assUid, newPersonAssigned)
              .then(() => {
                this.refreshAssignmentAndEmployeeArrayEvent.emit();
                this.toastService.showSuccess('Elemento modificato');
              })
              .catch((err: Error) => {
                this.toastService.showError(err);
              });
          } else {
            /* Reset the value */
            this.formPersonAssigned.setValue(this.assPersonAssigned);
            this.toastService.showErrorMessage('Non puoi assegnare più persone di quelle disponibili');
          }
        }
      });

    /* Form IsActive */
    this.subIsActive = this.formIsActive.valueChanges.subscribe((value) => {
      this.assignmentService
        .updateAssignmentActiveProp(this.assUid, this.assPersonMarked, value)
        .then(() => {
          this.refreshAssignmentAndEmployeeArrayEvent.emit();
          this.toastService.showSuccess('Elemento modificato');
        })
        .catch((err: Error) => {
          this.toastService.showError(err);
        });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assUid']) {
      /* Form PersonAssigned */
      this.formPersonAssigned.setValue(this.assPersonAssigned);
      if (!this.assActive) {
        this.formPersonAssigned.disable();
      }

      /* Form IsActive */
      this.formIsActive.setValue(this.assActive);
    }
  }

  ngOnDestroy(): void {
    if (this.subPersonAssigned) this.subPersonAssigned.unsubscribe();
    if (this.subIsActive) this.subIsActive.unsubscribe();
  }

  /* ----------------------------------------------------- methods ----------------------------------------------------- */
  decreasPersonAssigned() {
    this.formPersonAssigned.setValue(this.formPersonAssigned.value - 1);
  }

  incrementPersonAssigned() {
    this.formPersonAssigned.setValue(this.formPersonAssigned.value + 1);
  }
}
