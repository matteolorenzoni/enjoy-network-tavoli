import { Injectable } from '@angular/core';
import { TransformService } from './transform.service';
import { EventEmployee } from '../models/type';
import { FirebaseReadService } from './firebase-crud/firebase-read.service';
import { FirebaseCreateService } from './firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase-crud/firebase-delete.service';
import { FirebaseUpdateService } from './firebase-crud/firebase-update.service';

@Injectable({
  providedIn: 'root'
})
export class EventEmployeeService {
  constructor(
    private firebaseCreateService: FirebaseCreateService,
    private firebaseReadService: FirebaseReadService,
    private firebaseUpdateService: FirebaseUpdateService,
    private firebaseDeleteService: FirebaseDeleteService,
    private transformService: TransformService
  ) {}

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getAllEventEmployees(eventUid: string): Promise<EventEmployee[]> {
    const querySnapshot = await this.firebaseReadService.getAllEventEmployees(eventUid);
    const eventEmployees: EventEmployee[] = this.transformService.qsToEventEmployees(querySnapshot);
    return eventEmployees;
  }

  /* ------------------------------------------- ADD ------------------------------------------- */

  /* ------------------------------------------- UPDATE ------------------------------------------- */
  public async updateEventEmployeePersonAssigned(
    eventUid: string,
    eventEmployeeUid: string,
    personAssigned: number
  ): Promise<void> {
    const propsToUpdate = { personAssigned };
    await this.firebaseUpdateService.updateEventEmployeeProps(eventUid, eventEmployeeUid, propsToUpdate);
  }

  public async updateEventEmployeeActive(
    eventUid: string,
    eventEmployeeUid: string,
    personMarked: number,
    active: boolean
  ): Promise<void> {
    /** If the person is not active for the event, are removed as many as person assigned as possible  */
    const propsToUpdate = active ? { active } : { personAssigned: personMarked, active };
    await this.firebaseUpdateService.updateEventEmployeeProps(eventUid, eventEmployeeUid, propsToUpdate);
  }
}
