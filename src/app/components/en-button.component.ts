import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonType, PaletteType } from '../models/enum';

@Component({
  selector: 'en-button[text]',
  // eslint-disable-next-line prettier/prettier
  template: ` <div [ngClass]="['container', 'mx-auto', 'theme-' + palette]">
    <button
      [type]="buttonType"
      [name]="name"
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
        hover:-translate-y-1
        hover:scale-110
        hover:bg-paletteHover
        hover:text-paletteHover
        active:bg-paletteActive
        active:shadow-lg"
      (click)="triggerClickCustom()">
      {{ text | uppercase }}
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
  @Input() name?: string = '';
  @Input() text!: string;
  @Input() palette?: `${PaletteType}` = PaletteType.PRIMARY;
  @Input() buttonType?: `${ButtonType}` = ButtonType.BUTTON;

  @Output() customClick: EventEmitter<unknown> = new EventEmitter<unknown>();

  constructor() {
    // do nothing
  }

  ngOnInit(): void {}

  triggerClickCustom() {
    this.customClick.emit();
  }
}
