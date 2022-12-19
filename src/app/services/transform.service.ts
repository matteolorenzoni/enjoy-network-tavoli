import { Injectable } from '@angular/core';
import { DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { EventEmployeeDTO } from '../models/table';
import { EventEmployee } from '../models/type';

@Injectable({
  providedIn: 'root'
})
export class TransformService {
  /* ------------------------------------------- EVENT EMPLOYEE ------------------------------------------- */
  public qsToEventEmployees(querySnapshot: QuerySnapshot<DocumentData>): EventEmployee[] {
    const eventEmployees: EventEmployee[] = [];
    querySnapshot.forEach((eventDoc) => {
      const eventEmployee: EventEmployee = {
        uid: eventDoc.id,
        eventEmployeeDTO: eventDoc.data() as EventEmployeeDTO
      };
      eventEmployees.push(eventEmployee);
    });
    return eventEmployees;
  }
}
