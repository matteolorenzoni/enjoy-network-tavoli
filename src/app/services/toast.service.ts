import { UserService } from 'src/app/services/user.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CustomErrorService } from './custom-error.service';
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

  constructor(private userService: UserService, private customErrorService: CustomErrorService) {}

  /* Success */
  public showSuccess(message: string): void {
    this.show(ToastType.SUCCESS, message);
  }

  /* Error */
  public showError(err: Error): void {
    const employeeUid = this.userService.getUserUid();
    this.customErrorService.createCustomError(err.message, err.stack || '', employeeUid);
    console.error(err.message);
    this.show(ToastType.ERROR, err.message.split('DEBUG:')[0]);
  }

  public showErrorMessage(message: string): void {
    const employeeUid = this.userService.getUserUid();
    this.customErrorService.createCustomError(message, new Error().stack || '', employeeUid);
    console.error(message);
    this.show(ToastType.ERROR, message.split('DEBUG:')[0]);
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
