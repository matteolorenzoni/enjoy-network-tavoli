import { Injectable } from '@angular/core';
import { DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { AssignmentDTO } from '../models/table';
import { Assignment } from '../models/type';

@Injectable({
  providedIn: 'root'
})
export class TransformService {
  /* ------------------------------------------- EVENT EMPLOYEE ------------------------------------------- */
  public qsToAssignments(querySnapshot: QuerySnapshot<DocumentData>): Assignment[] {
    const assignments: Assignment[] = [];
    querySnapshot.forEach((eventDoc) => {
      const assignment: Assignment = {
        uid: eventDoc.id,
        assignmentDTO: eventDoc.data() as AssignmentDTO
      };
      assignments.push(assignment);
    });
    return assignments;
  }
}
