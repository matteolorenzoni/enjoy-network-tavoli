import { Injectable } from '@angular/core';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { RoleType } from '../models/enum';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  constructor(private firebaseReadService: FirebaseReadService) {}
  /* ------------------------------------------- GET ------------------------------------------- */
  public getEmployeeRole(): RoleType | null {
    return (sessionStorage.getItem('role') as RoleType) || null;
  }

  /* ------------------------------------------- SET ------------------------------------------- */
  public async setEmployeePropsInSessionStorage(employeeUid: string): Promise<void> {
    const employee = await this.firebaseReadService.getEmployeeByUid(employeeUid);
    const { uid, employeeDTO } = employee;
    sessionStorage.setItem('uid', uid);
    Object.entries(employeeDTO).forEach(([key, value]) => {
      sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    });
  }
}
