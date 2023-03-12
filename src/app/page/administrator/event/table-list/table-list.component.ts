import { TableService } from 'src/app/services/table.service';
import { SessionStorageService } from 'src/app/services/sessionstorage.service';
import { ToastService } from 'src/app/services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { fadeInAnimation, staggeredFadeInIncrement } from 'src/app/animations/animations';
import { Assignment, Table } from 'src/app/models/type';
import { AssignmentService } from 'src/app/services/assignment.service';
import { Subscription } from 'rxjs';
import { RoleType } from '../../../../models/enum';
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

  /* Employee */
  employeeUid: string | null = null;
  employeeRole: RoleType | null = null;

  /* Event */
  eventUid: string | null = null;
  eventDate: Date | null = null;
  eventStart: Date | null = null;
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
    private toastService: ToastService,
    private sessionStorage: SessionStorageService
  ) {}

  /* ---------------------------------------- LifeCycle ---------------------------------------- */
  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');
    this.employeeUid = this.sessionStorage.getEmployeeUid();
    this.employeeRole = this.sessionStorage.getEmployeeRole();

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
        this.eventStart = event.props.timeStart;
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

    if (this.employeeRole !== RoleType.ADMINISTRATOR) {
      this.assignmentService
        .getAssignmentByEventUidAndEmployeeUid(this.eventUid, this.employeeUid)
        .then((assignment) => {
          this.eventPersonMarked = assignment ? assignment.props.personMarked : 0;
          this.eventMaxPersonAssigned = assignment ? assignment.props.maxPersonMarkable : 0;
        })
        .catch((error: Error) => {
          this.toastService.showError(error);
        });
    } else {
      this.assignmentService
        .getAssignmentsByEventUid(this.eventUid)
        .then((assignments: Assignment[]) => {
          this.eventPersonMarked = assignments.reduce((acc, cur) => acc + cur.props.personMarked, 0);
          this.eventMaxPersonAssigned = assignments.reduce((acc, cur) => acc + cur.props.maxPersonMarkable, 0);
        })
        .catch((error: Error) => {
          this.toastService.showError(error);
        });
    }
  }

  /* To get the list of tables */
  getTables(): void {
    if (!this.eventUid || !this.employeeUid) {
      throw new Error('Errore: parametri non validi');
    }

    const that = this;

    if (this.employeeRole !== RoleType.ADMINISTRATOR) {
      this.tablesSubscription = this.tableService
        .getRealTimeTableByEventUidAndEmployeeUid(this.eventUid, this.employeeUid)
        .subscribe({
          next(data: Table[]) {
            that.tables = data;
          },
          error(error: Error) {
            that.toastService.showError(error);
          }
        });
    } else {
      this.tablesSubscription = this.tableService.getRealTimeTableByEventUid(this.eventUid).subscribe({
        next(data: Table[]) {
          that.tables = data;
        },
        error(error: Error) {
          that.toastService.showError(error);
        }
      });
    }
  }

  /* ---------------------------------------- Methods ---------------------------------------- */
  goToCreateTable(): void {
    this.router.navigate(['./null'], { relativeTo: this.route });
  }
}
