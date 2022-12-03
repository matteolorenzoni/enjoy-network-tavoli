import { Component, Input } from '@angular/core';
import { PaletteType } from '../models/enum';
import { IconLink } from '../models/type';

@Component({
  selector: 'en-bottom-navigation[navigationMenu]',
  template: ` <div [ngClass]="['theme-' + palette, 'mt-24']">
    <nav class="fixed left-0 bottom-0 right-0 h-24 p-4 backdrop-blur-sm">
      <!-- <ul class="btm-nav btm-nav-md"> -->
      <ul
        class="m-auto flex h-full max-w-[48rem] flex-row items-center justify-center overflow-hidden rounded-lg bg-gray-800">
        <li
          *ngFor="let icon of navigationMenu"
          [routerLink]="icon.link"
          routerLinkActive="text-palette border-t border-current"
          class="flex-column relative flex h-full basis-full cursor-pointer items-center justify-center gap-1 bg-gray-800 text-white">
          <a><fa-icon [icon]="icon.defination"></fa-icon></a>
        </li>
      </ul>
    </nav>
  </div>`,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class EnBottomNavigationComponent {
  @Input() palette?: `${PaletteType}` = PaletteType.PRIMARY;
  @Input() navigationMenu!: IconLink[];
}
