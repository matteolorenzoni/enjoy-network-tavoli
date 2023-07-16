import { Component, Input } from '@angular/core';
import { PaletteType } from '../models/enum';
import { BottomNavigation } from '../models/type';

@Component({
  selector: 'en-bottom-navigation[bottomNavigation]',
  template: ` <div [ngClass]="['theme-' + palette]">
    <nav class="fixed bottom-0 left-0 right-0 z-20 h-20 p-0 backdrop-blur-sm xs:h-24 xs:p-4">
      <ul
        class="m-auto flex h-full max-w-[48rem] flex-row items-center justify-center overflow-hidden rounded-lg bg-gray-800 bg-opacity-30">
        <li
          *ngFor="let icon of bottomNavigation?.icons"
          [routerLink]="icon.link"
          [queryParamsHandling]="bottomNavigation?.role === 'inspector' ? 'preserve' : ''"
          class="flex h-full basis-full cursor-pointer flex-col items-center justify-center gap-1 bg-gray-800 bg-opacity-10  xs:bg-opacity-40"
          routerLinkActive=" border-t border-current"
          #rla="routerLinkActive"
          [ngClass]="rla.isActive ? 'text-palette' : 'text-slate-300'">
          <a><fa-icon [icon]="icon.definition" class=""></fa-icon></a>
          <span class="text-xs  xs:text-sm">{{ icon.name }}</span>
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
  @Input() bottomNavigation?: BottomNavigation;
}
