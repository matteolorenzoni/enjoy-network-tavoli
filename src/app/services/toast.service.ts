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

  constructor() {
    // do nothing
  }

  public showSuccess(message: string): void {
    this.show(ToastType.SUCCESS, message);
  }

  public showError(err: Error): void {
    console.error(err);
    this.show(ToastType.ERROR, err.message);
  }

  public showErrorMessage(message: string): void {
    console.error(message);
    this.show(ToastType.ERROR, message);
  }

  public showWarning(message: string): void {
    this.show(ToastType.WARNING, message);
  }

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

  public getToastStyle(): string {
    switch (this.toast$.value.type) {
      case ToastType.SUCCESS:
        return 'bg-emerald-400 text-emerald-700';
      case ToastType.ERROR:
        return 'bg-red-400 text-red-700';
      case ToastType.WARNING:
        return 'bg-yellow-400 text-yellow-700';
      case ToastType.INFO:
        return 'bg-blue-400 text-blue-700';
      default:
        return 'bg-emerald-400 text-emerald-700';
    }
  }
}
