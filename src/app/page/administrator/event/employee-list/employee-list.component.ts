/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
import { EventService } from 'src/app/services/event.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee, Event, EventEmployee } from 'src/app/models/type';
import { ToastService } from 'src/app/services/toast.service';
import { faArrowLeft, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { EmployeeService } from 'src/app/services/employee.service';
import {
  fadeInCreateItemAnimation,
  slideInCreateItemHeader,
  staggeredFadeInIncrement
} from 'src/app/animations/animations';
import { EmployeeDTO } from 'src/app/models/table';
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
  evEmArray: (EventEmployee | Pick<EmployeeDTO, 'name' | 'lastName' | 'zone'>)[] = [];

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
        const { uid, eventDTO } = event;
        this.event = { uid, eventDTO };
        this.maxPerson = eventDTO.maxPerson;
      })
      .catch((error: Error) => {
        this.toastService.showError(error.message);
      });
  }

  getEventEmployee(eventUid: string): void {
    this.eventEmployeeService
      .getEventEmployeesByEventUid(eventUid)
      .then((eventEmployees) => {
        this.eventEmployeeArray = eventEmployees;
        this.personMarked = 0;
        this.personAssigned = 0;
        this.eventEmployeeArray.forEach((item) => {
          this.personMarked += item.eventEmployeeDTO.eventPersonMarked;
          this.personAssigned += item.eventEmployeeDTO.eventPersonAssigned;
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
      .getEmployeeByMultipleUid(employeeUids)
      .then((employees) => {
        this.employeeArray = employees;
        this.evEmArray = this.employeeArray
          .map((employee) => {
            const eventEmployee =
              this.eventEmployeeArray.find((item) => item.eventEmployeeDTO.employeeUid === employee.uid) ??
              ({} as EventEmployee);
            return {
              ...eventEmployee,
              name: employee.employeeDTO.name,
              lastName: employee.employeeDTO.lastName,
              zone: employee.employeeDTO.zone
            };
          })
          .sort(
            (a, b) =>
              Number(b.eventEmployeeDTO.eventActive) - Number(a.eventEmployeeDTO?.eventActive) ||
              b.eventEmployeeDTO.eventPersonAssigned - a.eventEmployeeDTO.eventPersonAssigned ||
              b.eventEmployeeDTO.eventPersonMarked - a.eventEmployeeDTO.eventPersonMarked
          );
      })
      .catch((error: Error) => {
        this.toastService.showError(error.message);
      });
  }

  goBack(): void {
    this.location.back();
  }
}
