import { EventService } from 'src/app/services/event.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee, EvEm, Event, EventEmployee } from 'src/app/models/type';
import { ToastService } from 'src/app/services/toast.service';
import { faArrowLeft, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { EmployeeService } from 'src/app/services/employee.service';
import {
  fadeInCreateItemAnimation,
  slideInCreateItemHeader,
  staggeredFadeInIncrement
} from 'src/app/animations/animations';
import { EventEmployeeService } from '../../../../services/event-employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  animations: [slideInCreateItemHeader, fadeInCreateItemAnimation, staggeredFadeInIncrement]
})
export class EmployeeListComponent implements OnInit {
  /* Icons */
  backIcon = faArrowLeft;
  filterIcon = faFilter;

  uid = '';
  event!: Event;
  employeeArray: Employee[] = [];
  eventEmployeeArray: EventEmployee[] = [];
  evEmArray: EvEm[] = [];

  personMarked = 0;
  personAssigned = 0;
  maxPerson = 0;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private eventService: EventService,
    private employeeService: EmployeeService,
    private eventEmployeeService: EventEmployeeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid') ?? '';
    this.getData();
  }

  getData(): void {
    this.getEvent(this.uid);
    this.getEventEmployee(this.uid);
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

  getEventEmployee(eventUid: string): void {
    this.eventEmployeeService
      .getAllEventEmployees(eventUid)
      .then((eventEmployees) => {
        this.eventEmployeeArray = eventEmployees;
        this.personMarked = 0;
        this.personAssigned = 0;
        this.eventEmployeeArray.forEach((item) => {
          this.personMarked += item.eventEmployeeDTO.personMarked;
          this.personAssigned += item.eventEmployeeDTO.personAssigned;
        });
        this.getEmployee();
      })
      .catch((error: Error) => {
        this.toastService.showError(error.message);
      });
  }

  getEmployee() {
    const employeeUids = this.eventEmployeeArray.map((item) => item.eventEmployeeDTO.employeeUid);
    this.employeeService
      .getEmployeesByUids(employeeUids)
      .then((employees) => {
        this.employeeArray = employees;
        this.evEmArray = this.employeeArray.map((employee) => {
          const eventEmployee = this.eventEmployeeArray.find(
            (item) => item.eventEmployeeDTO.employeeUid === employee.uid
          );
          return {
            ...(eventEmployee ?? ({} as EventEmployee)),
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
}
