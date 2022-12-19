import { EventService } from 'src/app/services/event.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, EvEm, Event, Assignment } from 'src/app/models/type';
import { ToastService } from 'src/app/services/toast.service';
import { faAdd, faArrowLeft, faFilter } from '@fortawesome/free-solid-svg-icons';
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
  addIcon = faAdd;

  uid = '';
  event!: Event;
  employeeArray: Employee[] = [];
  assignments: Assignment[] = [];
  evEmArray: EvEm[] = [];

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
    this.uid = this.route.snapshot.paramMap.get('uid') ?? '';
    this.getData();
  }

  getData(): void {
    this.getEvent(this.uid);
  }

  getEvent(eventUid: string): void {
    this.eventService
      .getEvent(eventUid)
      .then((event) => {
        this.event = event;
        this.maxPerson = this.event.eventDTO.maxPerson;
      })
      .catch((error: Error) => {
        this.toastService.showError(error.message);
      });
  }

  getEmployee() {
    const employeeUids = this.assignments.map((item) => item.assignmentDTO.employeeUid);
    this.employeeService
      .getEmployeesByUids(employeeUids)
      .then((employees) => {
        this.employeeArray = employees;
        this.evEmArray = this.employeeArray.map((employee) => {
          const assignment = this.assignments.find((item) => item.assignmentDTO.employeeUid === employee.uid);
          return {
            ...(assignment ?? ({} as Assignment)),
            name: employee.employeeDTO.name,
            lastName: employee.employeeDTO.lastName,
            zone: employee.employeeDTO.zone
          };
        });
      })
      .catch((error: Error) => {
        this.toastService.showError(error.message);
      });
  }

  goBack(): void {
    this.location.back();
  }

  goToSelector(): void {
    this.router.navigate(['../assignment-total'], { relativeTo: this.route });
  }
}
