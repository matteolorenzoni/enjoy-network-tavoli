import { QueryConstraint } from '@angular/fire/firestore';
import { Assignment, Employee, Event, Table } from '../models/type';

export interface Read {
  /* Event */
  getAllEvents(): Promise<Event[]>;
  getEventByUid(eventUid: string): Promise<Event>;
  getEventsByMultipleConstraints(constraints: QueryConstraint[]): Promise<Event[]>;

  /* Assignemnt */
  getAssignmentByUid(assignmentUid: string): Promise<Assignment>;
  getAssignmentsByMultipleConstraints(constraints: QueryConstraint[]): Promise<Assignment[]>;

  /* Employee */
  getAllEmployees(): Promise<Employee[]>;
  getEmployeeByUid(employeeUid: string): Promise<Employee>;
  getEmployeesByMultipleConstraints(constraints: QueryConstraint[]): Promise<Employee[]>;

  /* Table */
  getTableByUid(tableUid: string): Promise<Table>;
  getTablesByMultipleConstraints(constraints: QueryConstraint[]): Promise<Table[]>;
}
