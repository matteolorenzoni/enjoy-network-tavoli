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
        [name]="name + '_input'"
        [id]="name + '_input'"
        class="block w-full rounded-lg border border-slate-700 bg-slate-800 p-4 pl-16 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2"
        [ngStyle]="{ 'padding-left': leftRemPadding > 0 ? leftRemPadding + 'rem' : '4rem' }"
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
  @Input() name!: string;
  @Input() placeholder?: string;
  @Input() fc!: string;
  @Input() required = false;
  @Input() leftRemPadding = 0;
}
