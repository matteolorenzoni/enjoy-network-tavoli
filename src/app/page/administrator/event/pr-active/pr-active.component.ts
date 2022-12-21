import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faFilter } from '@fortawesome/free-solid-svg-icons';
import {
  slideInCreateItemHeader,
  fadeInCreateItemAnimation,
  staggeredFadeInIncrement
} from 'src/app/animations/animations';
import { Location } from '@angular/common';
import { Assignment, Employee } from 'src/app/models/type';
import { AssignmentService } from 'src/app/services/assignment.service';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../../services/employee.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-pr-active',
  templateUrl: './pr-active.component.html',
  styleUrls: ['./pr-active.component.scss'],
  animations: [slideInCreateItemHeader, fadeInCreateItemAnimation, staggeredFadeInIncrement]
})
export class PrActiveComponent implements OnInit {
  /* Icons */
  backIcon = faArrowLeft;
  filterIcon = faFilter;

  /* Event */
  eventUid = '';

  /* Employee */
  activePrs: Employee[] = [];

  /* Assignment */
  assignments: Assignment[] = [];
  assignmentEmployeeUids: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private assignmentService: AssignmentService,
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('uid') || '';

    if (!this.eventUid) {
      throw new Error('Event uid is not defined');
    }

    this.assignmentService
      .getAssignmentsByEventUid(this.eventUid)
      .then((assignments) => {
        this.assignments = assignments;
        this.assignmentEmployeeUids = assignments.map((assignment) => assignment.assignmentDTO.employeeUid);
      })
      .catch((error) => {
        this.toastService.showError(error.message);
      });

    this.employeeService
      .getEmployeesPrAndActive()
      .then((employees) => {
        this.activePrs = employees;
      })
      .catch((error) => {
        this.toastService.showError(error.message);
      });
  }

  isChecked(employee: Employee): boolean {
    return this.assignmentEmployeeUids.includes(employee.uid);
  }

  isDisabled(employee: Employee): boolean {
    const assignment = this.assignments.find((item) => item.assignmentDTO.employeeUid === employee.uid);
    const personMarked = assignment?.assignmentDTO.personMarked || 0;
    return personMarked > 0;
  }

  handleAssignmentChange(assignment: { checked: boolean; employeeUid: string }): void {
    const assignmentIndex = this.assignmentEmployeeUids.indexOf(assignment.employeeUid);
    if (assignmentIndex > -1) {
      this.assignmentEmployeeUids.splice(assignmentIndex, 1);
    } else {
      this.assignmentEmployeeUids.push(assignment.employeeUid);
    }
  }

  onSave(): void {
    const oldEmployeeUids = this.assignments.map((assignment) => assignment.assignmentDTO.employeeUid);
    const newEmployeeUids = this.assignmentEmployeeUids;
    const employeeAddedUids = newEmployeeUids.filter((employeeUid) => !oldEmployeeUids.includes(employeeUid));
    const removedEmployeeUids = oldEmployeeUids.filter((employeeUid) => !newEmployeeUids.includes(employeeUid));
    this.assignmentService
      .addAssignment(this.eventUid, employeeAddedUids)
      .then(() => {
        this.assignmentService.deleteAssignmentRemovedFromList(this.eventUid, removedEmployeeUids).then(() => {
          this.toastService.showSuccess('Lista aggiornata');
          this.goBack();
        });
      })
      .catch((error) => {
        this.toastService.showError(error.message);
      });
  }

  goBack(): void {
    this.location.back();
  }
}
