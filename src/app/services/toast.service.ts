import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastType } from '../models/enum';
import { Toast } from '../models/type';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toast$ = new BehaviorSubject<Toast>({
    type: null,
    message: null,
    isVisible: false
  });

  /* Success */
  public showSuccess(message: string): void {
    this.show(ToastType.SUCCESS, message);
  }

  /* Error */
  public showError(err: Error): void {
    console.error(err);
    this.show(ToastType.ERROR, err.message);
  }

  public showErrorMessage(message: string): void {
    console.error(message);
    this.show(ToastType.ERROR, message);
  }

  /* Warning */
  public showWarning(message: string): void {
    this.show(ToastType.WARNING, message);
  }

  /* Info */
  public showInfo(message: string): void {
    this.show(ToastType.INFO, message);
  }

  private show(type: ToastType, message: string): void {
    this.toast$.next({
      type,
      message,
      isVisible: true
    });
  }

  public hide(): void {
    this.toast$.next({
      type: null,
      message: null,
      isVisible: false
    });
  }
}
