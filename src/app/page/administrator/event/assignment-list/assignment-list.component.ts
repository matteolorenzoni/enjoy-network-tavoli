import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Assignment, AssignmentAndEmployee } from 'src/app/models/type';
import { ToastService } from 'src/app/services/toast.service';
import { faArrowLeft, faFilter, faList } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { EmployeeService } from 'src/app/services/employee.service';
import {
  fadeInCreateItemAnimation,
  slideInCreateItemHeader,
  staggeredFadeInIncrement
} from 'src/app/animations/animations';
import { AssignmentService } from 'src/app/services/assignment.service';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.scss'],
  animations: [slideInCreateItemHeader, fadeInCreateItemAnimation, staggeredFadeInIncrement]
})
export class AssignmentListComponent {
  /* Icons */
  backIcon = faArrowLeft;
  filterIcon = faFilter;
  listIcon = faList;

  /* Event */
  eventUid: string | null = null;

  /* Assignment */
  assignmentSubscription!: Subscription;

  /* Assignment and Employee */
  assignmentsAndEmployeeArray: AssignmentAndEmployee[] = [];
  personMarked = 0;
  personMarkedFromEmployeeDeleted = 0;
  maxPersonMarkable = 0;
  maxPerson = 0;

  /* -------------------------------------- Constructor -------------------------------------- */
  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private eventService: EventService,
    private employeeService: EmployeeService,
    private assignmentService: AssignmentService,
    private toastService: ToastService
  ) {}

  /* -------------------------------------- LifeCycle -------------------------------------- */
  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');

    if (!this.eventUid) {
      throw new Error('Parametri non validi');
    }

    const that = this;
    this.getEvent(this.eventUid);
    this.assignmentSubscription = this.assignmentService.getRealTimeAssignmentsByEventUid(this.eventUid).subscribe({
      next(data: Assignment[]) {
        that.maxPersonMarkable = data.reduce((acc, item) => acc + item.props.maxPersonMarkable, 0);
        that.personMarked = data.reduce((acc, item) => acc + item.props.personMarked, 0);
        that.personMarkedFromEmployeeDeleted = data
          .filter((x) => x.props.isActive === false)
          .reduce((acc, item) => acc + item.props.personMarked, 0);
        that.getEmployee(data);
      },
      error(error: Error) {
        that.toastService.showError(error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.assignmentSubscription) this.assignmentSubscription.unsubscribe();
  }

  /* -------------------------------------- HTTP Methods -------------------------------------- */
  getEvent(eventUid: string): void {
    this.eventService
      .getEvent(eventUid)
      .then((event) => {
        this.maxPerson = event.props.maxPerson;
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });
  }

  getEmployee(assignments: Assignment[]): void {
    const employeeUids = assignments.map((item) => item.props.employeeUid);
    this.employeeService
      .getEmployeesByUids(employeeUids)
      .then((employees) => {
        this.assignmentsAndEmployeeArray = [];
        employees.forEach((employee) => {
          const assignment = assignments.find((item) => item.props.employeeUid === employee.uid);
          if (assignment) {
            this.assignmentsAndEmployeeArray.push({ assignment, employee });
          }
        });
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });
  }

  /* -------------------------------------- Methods -------------------------------------- */
  goBack(): void {
    this.location.back();
  }

  goToSelector(): void {
    this.router.navigate(['../pr-active'], { relativeTo: this.route });
  }
}
