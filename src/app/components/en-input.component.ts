import { Component, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'en-input[name][fieldName][fc]',
  template: `
    <div class="group flex gap-4 rounded-lg border-slate-700 bg-slate-800 p-4">
      <label [for]="name + '_input'" class="shrink-0 text-sm uppercase text-slate-200 peer-disabled:text-red-800">
        {{ fieldName }}
      </label>
      <input
        [type]="type"
        [size]="size || 100"
        [pattern]="pattern || '.*'"
        [name]="name + '_input'"
        [id]="name + '_input'"
        class="w-full grow bg-transparent text-sm focus:outline-none disabled:cursor-not-allowed disabled:placeholder:text-gray-800"
        [formControlName]="fc"
        autocomplete="off"
        [placeholder]="placeholder || ''"
        [required]="required" />
    </div>
  `,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class EnInputComponent {
  @Input() fieldName!: string;
  @Input() type = 'text';
  @Input() pattern?: string | RegExp;
  @Input() size?: number;
  @Input() name!: string;
  @Input() placeholder?: string;
  @Input() fc!: string;
  @Input() required = false;
  @Input() leftRemPadding?: number;
}
