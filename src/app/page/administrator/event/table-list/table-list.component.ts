import { SessionStorageService } from 'src/app/services/sessionstorage.service';
import { ToastService } from 'src/app/services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { fadeInAnimation, staggeredFadeInIncrement } from 'src/app/animations/animations';
import { Table } from 'src/app/models/type';
import { AssignmentService } from 'src/app/services/assignment.service';
import { TableService } from '../../../../services/table.service';
import { EventService } from '../../../../services/event.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss'],
  animations: [staggeredFadeInIncrement, fadeInAnimation]
})
export class TableListComponent implements OnInit {
  /* Icons */
  filterIcon = faFilter;
  plusIcon = faPlus;

  /* Employee */
  employeeUid: string | null = null;

  /* Event */
  eventUid: string | null = null;
  eventDate: Date | null = null;
  eventPersonMarked = 0;
  eventPersonAssigned = 0;
  eventMaxPersonAssigned = 0;

  /* Table */
  tables: Table[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService,
    private assignmentService: AssignmentService,
    private tableService: TableService,
    private toastService: ToastService,
    private sessionStorage: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('uid');
    this.employeeUid = this.sessionStorage.getEmployeeUid();

    /* Check if the parameters are valid */
    if (!this.eventUid || !this.employeeUid) {
      throw new Error('Errore: parametri non validi');
    }

    this.getEventDate(this.eventUid);
    this.getEventMaxPersonAssigned(this.eventUid, this.employeeUid);
    this.getTables(this.eventUid, this.employeeUid);
  }

  getEventDate(eventUid: string): void {
    this.eventService
      .getEvent(eventUid)
      .then((event) => {
        this.eventDate = event.props.date;
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
      });
  }

  getEventMaxPersonAssigned(eventUid: string, employeeUid: string): void {
    this.assignmentService
      .getAssignmentsByEventUidAndEmployeeUid(eventUid, employeeUid)
      .then((assignments) => {
        /* Get the first assignment */
        this.eventMaxPersonAssigned = assignments.length > 0 ? assignments[0].props.personAssigned : 0;
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
      });
  }

  getTables(eventUid: string, employeeUid: string): void {
    this.tableService
      .getTableByEventUidAndEmployeeUid(eventUid, employeeUid)
      .then((tables: Table[]) => {
        this.tables = tables;

        /* Calculate the number of people assigned and marked */
        this.eventPersonMarked = tables.reduce(
          (acc, table) => acc + (table.props.personMarked ? table.props.personMarked : 0),
          0
        );
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
      });
  }

  goToCreateTable(): void {
    this.router.navigate([`create-item/${this.eventUid}/table/null`]);
  }

  onDeleteTableEvent(tableUid: string): void {
    this.tableService
      .deleteTable(tableUid)
      .then(() => {
        /* Check if the parameters are valid */
        if (!this.eventUid || !this.employeeUid) {
          throw new Error('Errore: parametri non validi');
        }

        this.getTables(this.eventUid, this.employeeUid);
        this.toastService.showSuccess('Tavolo eliminato con successo');
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
      });
  }
}
