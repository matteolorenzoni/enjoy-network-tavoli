import { Component } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'en-loader',
  template: `
    <div *ngIf="displayLoader" class="absolute left-0 top-0 z-50 h-screen w-screen backdrop-blur">
      <div class="flex h-full flex-col items-center justify-center">
        <fa-icon [icon]="spinnerIcon" class="fa-spin text-5xl text-primary-50"></fa-icon>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class EnLoaderComponent {
  /* Loader */
  displayLoader = false;

  /* Icon */
  spinnerIcon = faSpinner;

  constructor(private loaderService: LoaderService) {
    this.loaderService.loader$.subscribe((visibility) => {
      this.displayLoader = visibility;
    });
  }
}
