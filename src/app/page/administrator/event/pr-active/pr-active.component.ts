import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faFilter } from '@fortawesome/free-solid-svg-icons';
import {
  slideInCreateItemHeader,
  fadeInCreateItemAnimation,
  staggeredFadeInIncrement
} from 'src/app/animations/animations';
import { Location } from '@angular/common';
import { EmployeeAssignment } from 'src/app/models/type';
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
  eventUid?: string;

  /* EmployeeAssignment */
  employeesAssignments: EmployeeAssignment[] = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid') || undefined;

    this.getData();
  }

  async getData() {
    try {
      /* Get all the employees that are pr and active */
      const prActive = await this.employeeService.getEmployeesPrAndActive();

      /* Get all the assignments of the employees */
      prActive.forEach(async (employee) => {
        if (!this.eventUid) {
          throw new Error('Parametri non validi');
        }

        const assignment = await this.assignmentService.getAssignmentByEventUidAndEmployeeUid(
          this.eventUid,
          employee.uid
        );
        if (assignment) {
          this.employeesAssignments.push({ employee, assignment });
        } else {
          this.employeesAssignments.push({ employee });
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
