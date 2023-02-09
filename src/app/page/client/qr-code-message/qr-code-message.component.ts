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
  table!: Table;

  /* Participation */
  participationUid?: string;
  participation!: Participation;

  /* Client */
  client!: Client;

  /* QrCode */
  qrdata = 'aa';
  img = '../../../../assets/images/logo-dark.jpg';
  zoom = false;

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
    this.participationUid = this.route.snapshot.queryParams['participation'];
    if (!this.participationUid) {
      this.router.navigate(['error'], { relativeTo: this.route });
      return;
    }
    this.getParticipation();
  }

  getParticipation() {
    this.participationService
      .getParticipationByUid(this.participationUid as string)
      .then((participation) => {
        this.participation = participation;

        this.getEvent(this.participation.props.eventUid);
        this.getTable(this.participation.props.tableUid);
        this.getClient(this.participation.props.clientUid);
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
        this.router.navigate(['errore'], { relativeTo: this.route });
      });
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

  getTable(tableUid: string) {
    this.tableService
      .getTable(tableUid)
      .then((table) => {
        this.table = table;
        this.getEmployee(this.table.props.employeeUid);
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
        this.router.navigate(['error'], { relativeTo: this.route });
      });
  }

  getClient(clientUid: string) {
    this.clientService
      .getClient(clientUid)
      .then((client) => {
        this.client = client;
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
        this.router.navigate(['error'], { relativeTo: this.route });
      });
  }

  toggleZoom() {
    this.zoom = !this.zoom;
  }
}
