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
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

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

  /* Employee */
  employeeUid = '';
  administratorUids: string[] = [];
  employeeIsAdministrator = false;

  /* Event */
  eventUid: string | null = null;

  /* Assignment */
  assignmentSubscription!: Subscription;

  /* Assignment and Employee */
  assignmentsAndEmployeeArray: AssignmentAndEmployee[] = [];
  personMarked = 0;
  personMarkedFromEmployeeDeleted = 0;
  maxPersonMarkable = 0;
  eventMaxPerson = 0;

  /* -------------------------------------- Constructor -------------------------------------- */
  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService,
    private eventService: EventService,
    private employeeService: EmployeeService,
    private assignmentService: AssignmentService,
    private toastService: ToastService
  ) {
    this.employeeUid = this.userService.getUserUid();
    this.administratorUids = environment.administratorUids;
    this.employeeIsAdministrator = this.administratorUids.includes(this.employeeUid);
  }

  /* -------------------------------------- LifeCycle -------------------------------------- */
  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');

    this.getEventMaxPerson();
    this.getAssignments();
  }

  ngOnDestroy(): void {
    if (this.assignmentSubscription) this.assignmentSubscription.unsubscribe();
  }

  /* -------------------------------------- HTTP Methods -------------------------------------- */
  getEventMaxPerson(): void {
    if (!this.eventUid) {
      throw new Error('Errore: parametri non validi');
    }

    this.eventService
      .getEvent(this.eventUid)
      .then((event) => {
        this.eventMaxPerson = event.props.maxPerson;
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });
  }

  getAssignments(): void {
    if (!this.eventUid) {
      throw new Error('Parametri non validi');
    }

    const that = this;
    this.assignmentSubscription = this.assignmentService
      .getRealTimeAssignmentsByEventUidAndEmployeeUid(
        this.eventUid,
        !this.employeeIsAdministrator ? this.employeeUid : undefined
      )
      .subscribe({
        next(assignments: Assignment[]) {
          that.maxPersonMarkable = assignments.reduce((acc, item) => acc + item.props.maxPersonMarkable, 0);
          that.personMarked = assignments.reduce((acc, item) => acc + item.props.personMarked, 0);

          that.getEmployee(assignments);

          // that.personMarkedFromEmployeeDeleted = data
          //   .filter((x) => x.props.isActive === false)
          //   .reduce((acc, item) => acc + item.props.personMarked, 0);
        },
        error(error: Error) {
          that.toastService.showError(error);
        }
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
