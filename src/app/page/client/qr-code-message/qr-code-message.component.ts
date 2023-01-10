import { ParticipationService } from 'src/app/services/participation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { EventService } from 'src/app/services/event.service';
import { TableService } from 'src/app/services/table.service';
import { ToastService } from 'src/app/services/toast.service';
import { Client, Event, Participation, Table, Employee } from 'src/app/models/type';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-qr-code-message',
  templateUrl: './qr-code-message.component.html',
  styleUrls: ['./qr-code-message.component.scss']
})
export class QrCodeMessageComponent implements OnInit {
  /* Event */
  event!: Event;

  /* Employee */
  employee!: Employee;

  /* Table */
  tableUid?: string;
  table!: Table;

  /* Participation */
  participation!: Participation;

  /* Client */
  clientUid?: string;
  client!: Client;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private employeeService: EmployeeService,
    private tableService: TableService,
    private participationService: ParticipationService,
    private clientService: ClientService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.tableUid = this.route.snapshot.queryParams['table'];
    this.clientUid = this.route.snapshot.queryParams['client'];

    this.getParticipation();
    this.getClient();
    this.getTable();
  }

  getEvent(eventUid: string) {
    this.eventService
      .getEvent(eventUid)
      .then((event) => {
        if (!event) {
          this.router.navigate(['error'], { relativeTo: this.route });
          return;
        }

        this.event = event;
        console.log(this.event);
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
      });
  }

  getEmployee(employeeUid: string) {
    this.employeeService
      .getEmployee(employeeUid)
      .then((employee) => {
        this.employee = employee;
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
        this.router.navigate(['errore'], { relativeTo: this.route });
      });
  }

  getTable() {
    if (!this.tableUid) {
      this.router.navigate(['error'], { relativeTo: this.route });
      return;
    }

    this.tableService
      .getTable(this.tableUid)
      .then((table) => {
        this.table = table;
        this.getEmployee(this.table.props.employeeUid);
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
        this.router.navigate(['error'], { relativeTo: this.route });
      });
  }

  getParticipation() {
    if (!this.tableUid || !this.clientUid) {
      this.router.navigate(['error'], { relativeTo: this.route });
      return;
    }

    this.participationService
      .getParticipationByTableUidAndClientUid(this.tableUid, this.clientUid)
      .then((participation) => {
        if (!participation) {
          this.router.navigate(['error'], { relativeTo: this.route });
          return;
        }

        this.participation = participation;
        this.getEvent(this.participation.props.eventUid);
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
        this.router.navigate(['errore'], { relativeTo: this.route });
      });
  }

  getClient() {
    if (!this.clientUid) {
      this.router.navigate(['error'], { relativeTo: this.route });
      return;
    }

    this.clientService
      .getClient(this.clientUid)
      .then((client) => {
        this.client = client;
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
        this.router.navigate(['error'], { relativeTo: this.route });
      });
  }
}
