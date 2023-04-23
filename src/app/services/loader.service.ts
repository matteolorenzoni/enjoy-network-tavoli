import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loader$ = new BehaviorSubject<boolean>(false);

  show(): void {
    this.loader$.next(true);
  }

  hide(): void {
    this.loader$.next(false);
  }
}
