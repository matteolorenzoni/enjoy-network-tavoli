import { ActivatedRoute } from '@angular/router';
import { EvEm } from 'src/app/models/type';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faCircleMinus, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, Subscription } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AssignmentService } from '../services/assignment.service';

@Component({
  selector: 'en-item-event-employee[evEm][currentPersonAssigned][maxPerson]',
  template: ` <li class="my-2 flex h-16 flex-wrap items-center sm:h-12 sm:flex-nowrap">
    <div class="w-full grow-1 truncate text-center sm:w-max sm:basis-44 sm:text-left">
      {{ employeeName }} {{ employeeLastName }}
    </div>
    <div class="center w-1/5 grow-1 text-sm sm:w-max">{{ employeeZone | uppercase }}</div>
    <div class="center w-3/5 grow-1 gap-1 sm:w-max">
      <div class="center mr-1">{{ personMarked }}/{{ personAssigned }}</div>
      <div class="center relative flex h-6 w-24 flex-row rounded-lg bg-transparent">
        <button
          data-action="decrement"
          class="center h-full w-20 rounded-l bg-primary-60 text-black outline-none hover:bg-primary-50 active:bg-primary-40 enabled:cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200 "
          (click)="decreasPersonAssigned()"
          [disabled]="!active">
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
          [disabled]="!active">
          <span class="m">+</span>
        </button>
      </div>
    </div>
    <label class="relative inline-flex w-1/5 cursor-pointer items-center sm:w-max">
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
  @Input() evEm!: EvEm;
  @Input() currentPersonAssigned!: number;
  @Input() maxPerson!: number;

  @Output() refreshEvEmArrayEvent = new EventEmitter();

  /* Icons */
  incrementIcon = faCirclePlus;
  decrementIcon = faCircleMinus;

  /* Event */
  eventUid = '';

  /* evEm */
  uid = '';
  personMarked = 0;
  personAssigned = 0;
  active = true;
  employeeName = '';
  employeeLastName = '';
  employeeZone = '';

  /* Form */
  formPersonAssigned = new FormControl<number>(0, { nonNullable: true });
  formIsActive = new FormControl<boolean>(true, { nonNullable: true });

  /* Subscriptions */
  subPersonAssigned!: Subscription;
  subIsActive!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private toastService: ToastService
  ) {}

  /* ----------------------------------------------------- lifecycle hooks ----------------------------------------------------- */
  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('uid') || '';

    if (!this.eventUid) {
      throw new Error('Event uid is not defined');
    }

    /* Form PersonAssigned */
    this.subPersonAssigned = this.formPersonAssigned.valueChanges.pipe(debounceTime(1200)).subscribe((value) => {
      /* Check if the value is different from the previous one */
      if (this.personAssigned !== value) {
        /* Check if the value is less than the max person */
        const hipoteticalPersonAssigned = this.currentPersonAssigned + value - this.personAssigned;
        if (hipoteticalPersonAssigned <= this.maxPerson) {
          /* Update the value */
          this.assignmentService
            .updateAssignmentPersonAssigned(this.eventUid, this.uid, value)
            .then(() => {
              this.refreshEvEmArrayEvent.emit();
              this.toastService.showSuccess('Elemento modificato');
            })
            .catch((err: Error) => {
              this.toastService.showError(err.message);
            });
        } else {
          /* Reset the value */
          this.formPersonAssigned.setValue(this.personAssigned);
          this.toastService.showError('Non puoi assegnare più persone di quelle disponibili');
        }
      }
    });

    /* Form IsActive */
    this.subIsActive = this.formIsActive.valueChanges.subscribe((value) => {
      this.assignmentService
        .updateAssignmentActive(this.eventUid, this.uid, this.personMarked, value)
        .then(() => {
          this.refreshEvEmArrayEvent.emit();
          this.toastService.showSuccess('Elemento modificato');
        })
        .catch((err: Error) => {
          this.toastService.showError(err.message);
        });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['evEm']) {
      const { currentValue }: { currentValue: EvEm } = changes['evEm'];

      /* evEm */
      this.uid = currentValue.uid;
      this.employeeName = currentValue.name;
      this.employeeLastName = currentValue.lastName;
      this.employeeZone = currentValue.zone;
      this.personMarked = currentValue.assignmentDTO.personMarked;
      this.personAssigned = currentValue.assignmentDTO.personAssigned;
      this.active = currentValue.assignmentDTO.active;

      /* Form PersonAssigned */
      this.formPersonAssigned.setValue(currentValue.assignmentDTO.personAssigned);
      if (!this.active) {
        this.formPersonAssigned.disable();
      }

      /* Form IsActive */
      this.formIsActive.setValue(currentValue.assignmentDTO.active);
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
