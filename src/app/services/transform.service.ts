import { Injectable } from '@angular/core';
import { DocumentData, DocumentSnapshot, QuerySnapshot, Timestamp } from '@angular/fire/firestore';
import { EventDTO, EventEmployeeDTO } from '../models/table';
import { EventEmployee, Event } from '../models/type';

@Injectable({
  providedIn: 'root'
})
export class TransformService {
  /* ------------------------------------------- EVENT ------------------------------------------- */
  public qsToEvents(querySnapshot: QuerySnapshot<DocumentData>): Event[] {
    const events: Event[] = [];
    querySnapshot.forEach((eventDoc) => {
      const event: Event = {
        uid: eventDoc.id,
        eventDTO: eventDoc.data() as EventDTO
      };
      event.eventDTO.date = new Date((event.eventDTO.date as unknown as Timestamp).seconds * 1000);
      event.eventDTO.createdAt = new Date((event.eventDTO.createdAt as unknown as Timestamp).seconds * 1000);
      event.eventDTO.modificatedAt = new Date((event.eventDTO.modificatedAt as unknown as Timestamp).seconds * 1000);
      events.push(event);
    });
    return events;
  }

  public qsToEvent(docRef: DocumentSnapshot<DocumentData>): Event {
    if (docRef.exists()) {
      const event: Event = {
        uid: docRef.id,
        eventDTO: docRef.data() as EventDTO
      };
      event.eventDTO.date = new Date((event.eventDTO.date as unknown as Timestamp).seconds * 1000);
      event.eventDTO.createdAt = new Date((event.eventDTO.createdAt as unknown as Timestamp).seconds * 1000);
      event.eventDTO.modificatedAt = new Date((event.eventDTO.modificatedAt as unknown as Timestamp).seconds * 1000);
      return event;
    }
    throw new Error('Documento non trovato');
  }

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

  /* ------------------------------------------- EMPLOYEE ------------------------------------------- */
}
