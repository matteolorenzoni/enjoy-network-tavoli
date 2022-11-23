import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types/index';
import { InputType, PaletteType } from '../models/enum';

@Component({
  selector: 'en-field',
  template: `
    <div class="relative">
      <div
        *ngIf="icon"
        [ngClass]="palette === 'primary' ? 'text-orangePalette' : 'text-blackPalette'"
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
        <fa-icon [icon]="icon"></fa-icon>
      </div>
      <input
        [type]="fieldType"
        [ngClass]="palette === 'primary' ? 'text-white' : 'text-blackPalette'"
        class="
          focus:outline-none
          block
          w-full
          p-4
          pl-10
          rounded-lg
          text-white
          bg-blackPalette-900
          placeholder-orangePalette"
        [placeholder]="placeholder"
        required />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `
  ]
})
export class EnFieldComponent {
  @Input() fieldType: `${InputType}` = InputType.TEXT;
  @Input() icon?: IconDefinition;
  @Input() placeholder?: string;
  @Input() palette?: `${PaletteType}` = PaletteType.PRIMARY;
}
