import { Auth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CustomErrorService } from './custom-error.service';
import { ToastType } from '../models/enum';
import { Toast } from '../models/type';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  employeeUid = '';

  toast$ = new BehaviorSubject<Toast>({
    type: null,
    message: null,
    isVisible: false
  });

  constructor(private auth: Auth, private customErrorService: CustomErrorService) {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.employeeUid = user.uid;
      }
    });
  }

  /* Success */
  public showSuccess(message: string): void {
    this.show(ToastType.SUCCESS, message);
  }

  /* Error */
  public showError(err: Error): void {
    this.customErrorService.createCustomError(err.message, err.stack || '', this.employeeUid);
    console.error(err.message);
    this.show(ToastType.ERROR, err.message);
  }

  public showErrorMessage(message: string): void {
    function stackTrace() {
      const err = new Error();
      return err.stack;
    }

    this.customErrorService.createCustomError(message, stackTrace() || '', this.employeeUid);
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
