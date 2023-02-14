import { ParticipationService } from 'src/app/services/participation.service';
import { SessionStorageService } from 'src/app/services/sessionstorage.service';
import { ToastService } from 'src/app/services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { fadeInAnimation, staggeredFadeInIncrement } from 'src/app/animations/animations';
import { Table } from 'src/app/models/type';
import { AssignmentService } from 'src/app/services/assignment.service';
import { Subscription } from 'rxjs';
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
  eventMaxPersonAssigned = 0;

  /* Table */
  tables: Table[] = [];

  /* Participation */
  tablesSubscription!: Subscription;

  /* ---------------------------------------- Constructor ---------------------------------------- */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService,
    private assignmentService: AssignmentService,
    private tableService: TableService,
    private participationService: ParticipationService,
    private toastService: ToastService,
    private sessionStorage: SessionStorageService
  ) {}

  /* ---------------------------------------- LifeCycle ---------------------------------------- */
  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');
    this.employeeUid = this.sessionStorage.getEmployeeUid();

    this.getEventDate();
    this.getEventMaxPersonAssigned();
    this.getTables();
  }

  ngOnDestroy(): void {
    if (this.tablesSubscription) {
      this.tablesSubscription.unsubscribe();
    }
  }

  /* ---------------------------------------- Http methods ---------------------------------------- */
  /* To get the event date */
  getEventDate(): void {
    if (!this.eventUid) {
      throw new Error('Errore: parametri non validi');
    }
    this.eventService
      .getEvent(this.eventUid)
      .then((event) => {
        this.eventDate = event.props.date;
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
      });
  }

  /* To get the max person assigned for the event */
  getEventMaxPersonAssigned(): void {
    if (!this.eventUid || !this.employeeUid) {
      throw new Error('Errore: parametri non validi');
    }

    this.assignmentService
      .getAssignmentByEventUidAndEmployeeUid(this.eventUid, this.employeeUid)
      .then((assignment) => {
        this.eventMaxPersonAssigned = assignment ? assignment.props.maxPersonMarkable : 0;
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
      });
  }

  /* To get the list of tables */
  getTables(): void {
    if (!this.eventUid || !this.employeeUid) {
      throw new Error('Errore: parametri non validi');
    }

    const that = this;
    this.tablesSubscription = this.tableService
      .getRealTimeTableByEventUidAndEmployeeUid(this.eventUid, this.employeeUid)
      .subscribe({
        next(data: Table[]) {
          that.tables = data;
          const tableUids = data.map((table) => table.uid);
          that.getAllTableParticipation(tableUids);
        },
        error(error: Error) {
          that.toastService.showError(error);
        }
      });
  }

  /* To get the number of person marked for each table */
  getAllTableParticipation(tableUids: string[]): void {
    this.participationService
      .getParticipationsCountByMultiTableUid(tableUids)
      .then((count) => {
        this.eventPersonMarked = count;
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
      });
  }

  /* ---------------------------------------- Methods ---------------------------------------- */
  goToCreateTable(): void {
    this.router.navigate([`create-item/${this.eventUid}/table/null`]);
  }
}
