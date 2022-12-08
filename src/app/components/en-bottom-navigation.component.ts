import { Component, Input } from '@angular/core';
import { bottomNavigationAnimation } from '../animations/animations';
import { PaletteType } from '../models/enum';
import { IconLink } from '../models/type';

@Component({
  selector: 'en-bottom-navigation[navigationMenu]',
  template: ` <div [ngClass]="['theme-' + palette]">
    <nav [@bottomNavigationAnimation] class="fixed left-0 bottom-0 right-0 h-20 p-0 backdrop-blur-sm xs:h-24 xs:p-4">
      <!-- <ul class="btm-nav btm-nav-md"> -->
      <ul
        class="m-auto flex h-full max-w-[48rem] flex-row items-center justify-center overflow-hidden rounded-lg bg-gray-800 bg-opacity-30">
        <li
          *ngFor="let icon of navigationMenu"
          [routerLink]="icon.link"
          routerLinkActive="text-palette border-t border-current"
          class="flex h-full basis-full cursor-pointer flex-col items-center justify-center gap-1 bg-gray-800 bg-opacity-10  xs:bg-opacity-40">
          <a><fa-icon [icon]="icon.definition"></fa-icon></a>
          <span class="text-xs xs:text-sm">{{ icon.name }}</span>
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
  ],
  animations: [bottomNavigationAnimation]
})
export class EnBottomNavigationComponent {
  @Input() palette?: `${PaletteType}` = PaletteType.PRIMARY;
  @Input() navigationMenu!: IconLink[];
}
