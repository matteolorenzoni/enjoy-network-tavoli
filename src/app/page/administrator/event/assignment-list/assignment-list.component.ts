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

  eventUid = '';
  assignmentsAndEmployeeArray: AssignmentAndEmployee[] = [];

  personMarked = 0;
  personAssigned = 0;
  maxPerson = 0;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private eventService: EventService,
    private employeeService: EmployeeService,
    private assignmentService: AssignmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('uid') ?? '';

    if (!this.eventUid) {
      throw new Error('Event uid is not defined');
    }

    this.getData();
  }

  getData(): void {
    this.getEvent(this.eventUid);
    this.getAssignments(this.eventUid);
  }

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

  getAssignments(eventUid: string): void {
    this.assignmentService
      .getAssignmentsByEventUid(eventUid)
      .then((assignments) => {
        this.personAssigned = assignments.reduce((acc, item) => acc + item.props.personAssigned, 0);
        this.personMarked = assignments.reduce((acc, item) => acc + item.props.personMarked, 0);
        this.getEmployee(assignments);
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
            this.assignmentsAndEmployeeArray.push({
              ...assignment,
              name: employee.props.name,
              lastName: employee.props.lastName,
              zone: employee.props.zone
            } as AssignmentAndEmployee);
          }
        });
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });
  }

  goBack(): void {
    this.location.back();
  }

  goToSelector(): void {
    this.router.navigate(['../pr-active'], { relativeTo: this.route });
  }
}
