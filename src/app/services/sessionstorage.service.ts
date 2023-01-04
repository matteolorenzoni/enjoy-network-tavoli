import { Injectable } from '@angular/core';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { RoleType } from '../models/enum';
import { Collection } from '../models/collection';
import { employeeConverter } from '../models/converter';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  constructor(private firebaseReadService: FirebaseReadService) {}
  /* ------------------------------------------- GET ------------------------------------------- */
  public getEmployeeUid(): string | null {
    return sessionStorage.getItem('uid') || null;
  }

  public getEmployeeRole(): RoleType | null {
    return (sessionStorage.getItem('role') as RoleType) || null;
  }

  /* ------------------------------------------- SET ------------------------------------------- */
  public async setEmployeePropsInSessionStorage(employeeUid: string): Promise<void> {
    const employee = await this.firebaseReadService.getDocumentByUid(
      Collection.EMPLOYEES,
      employeeUid,
      employeeConverter
    );
    const { uid, props } = employee;
    sessionStorage.setItem('uid', uid);
    Object.entries(props).forEach(([key, value]) => {
      sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    });
  }
}
