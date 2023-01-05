import { Component } from '@angular/core';
import { toastAnimation } from '../animations/animations';
import { ToastType } from '../models/enum';
import { Toast } from '../models/type';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'en-toast',
  template: `
    <div
      [@toastAnimation]
      (@toastAnimation.done)="onToastAnimationDone()"
      *ngIf="toast.isVisible"
      [ngClass]="{
        'bg-emerald-600': toast.type === ToastType.SUCCESS,
        'bg-red-600': toast.type === ToastType.ERROR,
        'bg-gray-400': toast.type === ToastType.INFO
      }"
      class="absolute bottom-0 mx-auto flex w-[80%] max-w-3xl items-center rounded-lg py-3 px-6 font-roboto text-base font-medium text-white"
      role="alert">
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        [attr.data-icon]="toast.type === 'success' ? 'check-circle' : 'times-circle'"
        class="mr-2 h-4 w-4 fill-current"
        role="img"
        viewBox="0 0 512 512">
        <path
          *ngIf="toast.type === ToastType.SUCCESS"
          fill="currentColor"
          d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
        <path
          *ngIf="toast.type === ToastType.ERROR"
          fill="currentColor"
          d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path>
      </svg>
      {{ toast.message }}
    </div>
  `,
  styles: [
    `
      :host {
        position: fixed;
        bottom: 0%;
        width: 100%;
        display: flex;
        justify-content: center;
        z-index: 9999;
      }
    `
  ],
  animations: [toastAnimation]
})
export class EnToastComponent {
  /** Type */
  ToastType = ToastType;

  /** Toast */
  toast: Toast = {
    type: null,
    message: null,
    isVisible: false
  };

  constructor(private toastService: ToastService) {
    this.toastService.toast$.subscribe((toast) => {
      this.toast = toast;
    });
  }

  onToastAnimationDone(): void {
    this.toastService.hide();
  }
}
