import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  httpRequestsActive = 0;
  loader$ = new BehaviorSubject<boolean>(false);

  show(): void {
    this.httpRequestsActive += 1;

    this.loader$.next(true);

    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.touchAction = 'none';
  }

  hide(): void {
    this.httpRequestsActive -= 1;

    if (this.httpRequestsActive <= 0) {
      this.loader$.next(false);

      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
      document.body.style.touchAction = 'auto';
    }
  }
}
