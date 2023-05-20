import { Component, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'en-input[name][fieldName][fc]',
  template: `
    <div class="relative">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center p-2 text-sm uppercase text-slate-200">
        {{ fieldName }}
      </div>
      <input
        [type]="type"
        [size]="size || 100"
        [pattern]="pattern || '.*'"
        [name]="name + '_input'"
        [id]="name + '_input'"
        class="block w-full rounded-lg border border-slate-700 bg-slate-800 p-4 pl-16 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:border-gray-900 disabled:bg-gray-900 disabled:placeholder:text-gray-900"
        [ngStyle]="{ 'padding-left': leftRemPadding ? leftRemPadding + 'rem' : '4rem' }"
        [formControlName]="fc"
        autocomplete="off"
        [placeholder]="placeholder || ''"
        [required]="required" />
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
