import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonType, PaletteType } from '../models/enum';

@Component({
  selector: 'en-button[buttonName][buttonText]',
  // eslint-disable-next-line prettier/prettier
  template: ` <div [ngClass]="['container', 'mx-auto', 'theme-' + palette]">
    <button
      [name]="buttonName"
      [type]="buttonType"
      [disabled]="buttonIsDisabled"
      (click)="triggerClickCustom()"
      class="
        w-full
        rounded-lg
        bg-palette
        px-5
        py-2.5
        font-bold
        text-palette
        shadow-md
        transition
        duration-300
        ease-in-out
        enabled:hover:-translate-y-1
        enabled:hover:scale-110
        enabled:hover:bg-paletteHover
        enabled:hover:text-paletteHover
        enabled:active:bg-paletteActive
        enabled:active:shadow-lg
        disabled:bg-gray-700
        disabled:opacity-20">
      {{ buttonText | uppercase }}
    </button>
  </div>`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `
  ]
})
export class EnButtonComponent implements OnInit {
  @Input() buttonName!: string;
  @Input() buttonText!: string;
  @Input() buttonType?: `${ButtonType}` = ButtonType.BUTTON;
  @Input() buttonIsDisabled?: boolean = false;
  @Input() palette?: `${PaletteType}` = PaletteType.PRIMARY;

  @Output() customClick: EventEmitter<unknown> = new EventEmitter<unknown>();

  constructor() {
    // do nothing
  }

  ngOnInit(): void {}

  triggerClickCustom() {
    this.customClick.emit();
  }
}
