import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastTypeEnum } from '../models/enum';
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
    this.show(ToastTypeEnum.SUCCESS, message);
  }

  public showError(message: string): void {
    this.show(ToastTypeEnum.ERROR, message);
  }

  public showWarning(message: string): void {
    this.show(ToastTypeEnum.WARNING, message);
  }

  public showInfo(message: string): void {
    this.show(ToastTypeEnum.INFO, message);
  }

  private show(type: ToastTypeEnum, message: string): void {
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
      case ToastTypeEnum.SUCCESS:
        return 'bg-emerald-400 text-emerald-700';
      case ToastTypeEnum.ERROR:
        return 'bg-red-400 text-red-700';
      case ToastTypeEnum.WARNING:
        return 'bg-yellow-400 text-yellow-700';
      case ToastTypeEnum.INFO:
        return 'bg-blue-400 text-blue-700';
      default:
        return 'bg-emerald-400 text-emerald-700';
    }
  }
}
