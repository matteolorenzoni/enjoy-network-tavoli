import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaletteType } from '../models/enum';

@Component({
  selector: 'en-button[text][click]',
  // eslint-disable-next-line prettier/prettier
  template: ` <div class="container">
    <button
      type="button"
      [name]="name"
      [ngClass]="palette === 'primary' ? 'text-orangePalette bg-blackPalette' : 'text-blackPalette bg-orangePalette'"
      class="
        hover:bg-white
        hover:text-orangePalette
        hover:-translate-y-1
        hover:scale-110
        w-full
        px-5
        py-2.5
        font-bold
        rounded-lg
        transition
        ease-in-out
        duration-300">
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

  @Output() click: EventEmitter<unknown> = new EventEmitter<unknown>();

  constructor() {
    // do nothing
  }

  ngOnInit(): void {}
}
