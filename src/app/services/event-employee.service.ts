import { EmployeeService } from 'src/app/services/employee.service';
import { Injectable } from '@angular/core';
import { getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { collection, doc, getFirestore, writeBatch } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { EventEmployeeDTO, Table } from '../models/table';
import { Employee, EventEmployee } from '../models/type';

const EVENT_UID = 'eventUid';

@Injectable({
  providedIn: 'root'
})
export class EventEmployeeService {
  /** Database */
  private db = getFirestore();

  constructor(private employeeService: EmployeeService) {}

  /* ------------------------------------------- SET ------------------------------------------- */
  public async addEventEmployee(eventUid: string): Promise<void> {
    const prActive: Employee[] = await this.employeeService.getEmployeesPrAndActive();
    if (!environment.production) console.log('addEventEmployee', prActive);
    const batch = writeBatch(this.db);
    prActive.forEach((employee) => {
      const obj: EventEmployeeDTO = {
        employeeUid: employee.uid,
        eventUid,
        eventActive: true,
        eventPersonMarked: 0,
        eventPersonAssigned: 0
      };
      const docRef = doc(collection(this.db, Table.EVENT_EMPLOYEES));
      batch.set(docRef, obj);
    });
    await batch.commit();
    if (!environment.production) console.log('addEventEmployee', eventUid);
  }

  public async updateEventPersonAssigned(eventEmployeeUid: string, eventPersonAssigned: number): Promise<void> {
    const docRef = doc(this.db, Table.EVENT_EMPLOYEES, eventEmployeeUid);
    await updateDoc(docRef, { eventPersonAssigned });
    if (!environment.production) console.log('updateEventPersonAssigned', eventEmployeeUid, eventPersonAssigned);
  }

  public async updateEventActive(
    eventEmployeeUid: string,
    eventPersonMarked: number,
    eventActive: boolean
  ): Promise<void> {
    const docRef = doc(this.db, Table.EVENT_EMPLOYEES, eventEmployeeUid);
    if (eventActive) {
      await updateDoc(docRef, { eventActive: true });
    } else {
      /** If the person is not active for the event, are removed as many as person assigned as possible  */
      await updateDoc(docRef, { eventActive: false, eventPersonAssigned: eventPersonMarked });
    }
    if (!environment.production) console.log('updateEventActive', eventEmployeeUid, eventPersonMarked, eventActive);
  }

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getEventEmployees(): Promise<EventEmployee[]> {
    const collectionRef = collection(this.db, Table.EVENT_EMPLOYEES);
    const querySnapshot = await getDocs(collectionRef);
    if (!environment.production) console.log('getEventEmployees', querySnapshot.docs);
    if (querySnapshot.size > 0) {
      return querySnapshot.docs.map((eventDoc) => {
        const uid = eventDoc.id;
        const eventEmployeeDTO = eventDoc.data() as EventEmployeeDTO;
        return { uid, eventEmployeeDTO };
      });
    }
    return [];
  }

  public async getEventEmployeesByEventUid(eventUid: string): Promise<EventEmployee[]> {
    const q = query(collection(this.db, Table.EVENT_EMPLOYEES), where(EVENT_UID, '==', eventUid));
    const querySnapshot = await getDocs(q);
    if (!environment.production) console.log('getEventEmployeesByEventUid', querySnapshot.docs);
    if (querySnapshot.size > 0) {
      return querySnapshot.docs.map((eventEmployeeDoc) => {
        const uid = eventEmployeeDoc.id;
        const eventEmployeeDTO = eventEmployeeDoc.data() as EventEmployeeDTO;
        return { uid, eventEmployeeDTO };
      });
    }
    return [];
  }

  public async deleteEventEmployees(eventUid: string): Promise<void> {
    const eventEmployeesByEventuid: EventEmployee[] = await this.getEventEmployeesByEventUid(eventUid);
    if (!environment.production) console.log('deleteEventEmployees', eventEmployeesByEventuid);
    const batch = writeBatch(this.db);
    eventEmployeesByEventuid.forEach((eventEmployee) => {
      const eventEmployeeUid = eventEmployee.uid;
      const docRef = doc(this.db, Table.EVENT_EMPLOYEES, eventEmployeeUid);
      batch.delete(docRef);
    });
    await batch.commit();
    if (!environment.production) console.log('deleteEventEmployees', eventUid);
  }
}
