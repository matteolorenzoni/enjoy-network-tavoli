import { Injectable } from '@angular/core';
import { FirebaseReadService } from './firebase-crud/firebase-read.service';
import { RoleType } from '../models/enum';
import { EmployeeDTO } from '../models/table';
import { TransformService } from './transform.service';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  constructor(private firebaseReadService: FirebaseReadService, private transformService: TransformService) {}
  /* ------------------------------------------- GET ------------------------------------------- */
  public getEmployeeRole(): RoleType | null {
    return (sessionStorage.getItem('role') as RoleType) || null;
  }

  /* ------------------------------------------- SET ------------------------------------------- */
  public async setEmployeePropsInLocalStorage(employeeUid: string): Promise<void> {
    const docRef = await this.firebaseReadService.getEmployeeByUid(employeeUid);
    const employee = this.transformService.qsToEmployee(docRef);
    const { uid, employeeDTO } = employee;
    sessionStorage.setItem('uid', uid);
    Object.keys(employeeDTO).forEach((key) => {
      sessionStorage.setItem(key, JSON.stringify(employeeDTO[key as keyof EmployeeDTO]));
    });
  }
}
