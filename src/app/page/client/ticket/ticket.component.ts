import { ParticipationService } from 'src/app/services/participation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { TableService } from 'src/app/services/table.service';
import { ToastService } from 'src/app/services/toast.service';
import { Event, Participation, Table } from 'src/app/models/type';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  /* Event */
  event!: Event;

  /* Table */
  table!: Table;

  /* Participation */
  participationUid?: string;
  participation!: Participation;

  /* QrCode */
  qrdata = '';
  img = '../../../../assets/images/logo-dark.jpg';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private tableService: TableService,
    private participationService: ParticipationService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.participationUid = this.route.snapshot.queryParams['participation'];
    if (!this.participationUid) {
      this.router.navigate(['error'], { relativeTo: this.route });
      return;
    }

    this.qrdata = this.participationUid;
    this.getParticipation();
  }

  getParticipation() {
    this.participationService
      .getParticipationByUid(this.participationUid as string)
      .then((participation) => {
        this.participation = participation;

        this.getTable(this.participation.props.tableUid);
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
        this.getEvent(this.table.props.eventUid);
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
        this.router.navigate(['error'], { relativeTo: this.route });
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
}
