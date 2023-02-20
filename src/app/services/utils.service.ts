import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  public capitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLocaleLowerCase();
  }
}
