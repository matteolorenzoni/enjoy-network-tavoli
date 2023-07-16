import { Component, Output, EventEmitter } from '@angular/core';
import { fadeInAnimation } from '../animations/animations';

@Component({
  selector: 'en-file-loader[loadFileEvent]',
  template: ` <label
    [@fadeInAnimation]
    for="dropzone-file"
    class="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-gray-700 active:border-gray-500 active:bg-gray-600">
    <div class="flex flex-col items-center justify-center pb-6 pt-5">
      <svg
        aria-hidden="true"
        class="mb-3 h-10 w-10 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
      </svg>
      <p class="mb-2 text-sm text-gray-400">
        <span class="font-semibold">Clicca per caricare</span>
      </p>
      <p class="text-xs text-gray-400">PNG, JPG or JPEG (MAX. 800x400px)</p>
    </div>
    <input id="dropzone-file" type="file" class="hidden" accept="image/png, image/jpeg" (change)="loadPhoto($event)" />
  </label>`,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
    `
  ],
  animations: [fadeInAnimation]
})
export class EnFileLoaderComponent {
  @Output() loadFileEvent = new EventEmitter<Event>();
  @Output() dragFileEvent = new EventEmitter<Event>();

  loadPhoto(e: Event) {
    this.loadFileEvent.emit(e);
  }
}
