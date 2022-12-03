import { Component, Input } from '@angular/core';
import { PaletteType } from '../models/enum';
import { IconLink } from '../models/type';

@Component({
  selector: 'en-bottom-navigation[navigationMenu]',
  template: ` <div [ngClass]="['theme-' + palette]">
    <nav>
      <!-- <ul class="btm-nav btm-nav-md"> -->
      <ul
        class="fixed right-2.5 bottom-2.5 left-2.5 m-auto flex h-16 max-w-[48rem] flex-row items-center justify-center overflow-hidden rounded-lg bg-gray-800">
        <li
          *ngFor="let icon of navigationMenu"
          [routerLink]="icon.link"
          routerLinkActive="active text-palette border-t border-current"
          class="flex-column relative flex h-full basis-full cursor-pointer items-center justify-center gap-1 bg-gray-800 bg-palette text-white">
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
