import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { IconDefinition } from '@fortawesome/fontawesome-common-types/index';
import { InputTypeEnum, PaletteTypeEnum } from '../models/enum';

@Component({
  selector: 'en-field[fieldName]',
  template: `
    <div [ngClass]="['container', 'mx-auto', 'theme-' + palette]">
      <div class="relative">
        <div *ngIf="filedIcon" class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 ">
          <fa-icon [icon]="filedIcon" class="text-palette"></fa-icon>
        </div>
        <input
          [type]="fieldType"
          [name]="fieldName"
          [disabled]="isDisabled"
          [value]="value"
          (input)="onChanged($event)"
          (blur)="onBlur()"
          [placeholder]="fieldPlaceholder"
          class="
            input
            w-full
            bg-palette
            p-4
            pl-10
            text-palette
            placeholder-gray-200
            focus:outline-primary-70" />
      </div>
      <!-- Da aggiungere al componente input => [ngClass]="{ 'has-error': formField?.invalid && formField?.dirty }"
        <label [for]="fieldName">
          <span class="mt-1 ml-1 flex items-center text-xs font-medium tracking-wide text-red-500">
            Questo campo è obbligatorio
        </span>
      </label> -->
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EnFieldComponent),
      multi: true
    }
  ]
})
export class EnFieldComponent implements OnInit, ControlValueAccessor {
  @Input() fieldName!: string;
  @Input() fieldType?: `${InputTypeEnum}` = InputTypeEnum.TEXT;
  @Input() filedIcon?: IconDefinition;
  @Input() fieldPlaceholder?: string;
  @Input() palette?: `${PaletteTypeEnum}` = PaletteTypeEnum.PRIMARY;
  @Input() parentForm?: FormGroup;

  /** For form control */
  public value: any = null;
  public changed!: (value: string | number) => void;
  public touched!: () => void;
  public isDisabled = false;

  constructor() {
    // do nothing
  }

  ngOnInit(): void {}

  // get formField(): FormControl {
  //   return this.parentForm?.get(this.fieldName) as FormControl;
  // }

  public onChanged(event: Event): void {
    const { value } = <HTMLInputElement>event.target;
    this.changed(value);
  }

  public onBlur(): void {
    this.touched();
  }

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.changed = fn;
  }

  public registerOnTouched(fn: any): void {
    this.touched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
