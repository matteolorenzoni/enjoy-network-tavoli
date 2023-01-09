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
  eventUid: string | null = null;

  /* Employee */
  activePrs: Employee[] = [];

  /* Assignment */
  assignments: Assignment[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private assignmentService: AssignmentService,
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');

    if (!this.eventUid) {
      throw new Error('Parametri non validi');
    }

    this.assignmentService
      .getAssignmentsByEventUid(this.eventUid)
      .then((assignments) => {
        this.assignments = assignments;
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });

    this.employeeService
      .getEmployeesPrAndActive()
      .then((employees) => {
        this.activePrs = employees;
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });
  }

  goBack(): void {
    this.location.back();
  }
}
