import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faFilter } from '@fortawesome/free-solid-svg-icons';
import {
  slideInCreateItemHeader,
  fadeInCreateItemAnimation,
  staggeredFadeInIncrement
} from 'src/app/animations/animations';
import { Location } from '@angular/common';
import { AssignmentAndEmployee } from 'src/app/models/type';
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

  async getData() {
    try {
      /* Get all the employees that are pr and active */
      const prActive = await this.employeeService.getEmployeesPrAndActive();

      /* Get all the assignments of the employees */
      prActive.forEach(async (employee) => {
        const assignments = await this.assignmentService.getAssignmentsByEmployeeUid(employee.uid);
        if (assignments.length > 0) {
          this.assignmentsAndEmployees.push({
            employee,
            assignment: assignments[0]
          });
        }
      });
    } catch (error: any) {
      this.toastService.showError(error);
    }
  }

  goBack(): void {
    this.location.back();
  }
}
