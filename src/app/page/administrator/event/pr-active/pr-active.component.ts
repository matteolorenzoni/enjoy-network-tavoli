import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faFilter } from '@fortawesome/free-solid-svg-icons';
import {
  slideInCreateItemHeader,
  fadeInCreateItemAnimation,
  staggeredFadeInIncrement
} from 'src/app/animations/animations';
import { Location } from '@angular/common';
import { AssignmentAndEmployee, Employee } from 'src/app/models/type';
import { AssignmentService } from 'src/app/services/assignment.service';
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

  /* AssignmentAndEmployee */
  assignmentsAndEmployees: AssignmentAndEmployee[] = [];

  constructor(
    private location: Location,
    private assignmentService: AssignmentService,
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.employeeService
      .getEmployeesPrAndActive()
      .then((employees) => {
        employees.forEach((employee) => {
          this.createAssignmentAndEmployeeArray(employee);
        });
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });
  }

  createAssignmentAndEmployeeArray(employee: Employee): void {
    this.assignmentService
      .getAssignmentsByEmployeeUid(employee.uid)
      .then((assignments) => {
        if (assignments.length > 0) {
          this.assignmentsAndEmployees.push({
            employee,
            assignment: assignments[0]
          });
        }
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });
  }

  goBack(): void {
    this.location.back();
  }
}
