import { TableService } from 'src/app/services/table.service';
import { ToastService } from 'src/app/services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { fadeInAnimation, staggeredFadeInIncrement } from 'src/app/animations/animations';
import { Assignment, Table } from 'src/app/models/type';
import { AssignmentService } from 'src/app/services/assignment.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
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
  employeeUid = '';
  administratorUids: string[] = [];
  employeeIsAdministrator = false;

  /* Event */
  eventUid: string | null = null;
  eventDate: Date | null = null;
  eventStart: Date | null = null;
  eventPersonMarked = 0;
  eventMaxPersonAssigned = 0;

  /* Assignment */
  assignmentSubscription!: Subscription;

  /* Table */
  tables: Table[] = [];

  /* Participation */
  tablesSubscription!: Subscription;

  /* ---------------------------------------- Constructor ---------------------------------------- */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private eventService: EventService,
    private assignmentService: AssignmentService,
    private tableService: TableService,
    private toastService: ToastService
  ) {
    this.employeeUid = this.userService.getUserUid();
    this.administratorUids = environment.administratorUids;
    this.employeeIsAdministrator = this.administratorUids.includes(this.employeeUid);
  }

  /* ---------------------------------------- LifeCycle ---------------------------------------- */
  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');

    this.getEventDate();
    this.getAssignments();

    this.getTables();
  }

  ngOnDestroy(): void {
    if (this.tablesSubscription) {
      this.tablesSubscription.unsubscribe();
    }

    if (this.assignmentSubscription) {
      this.assignmentSubscription.unsubscribe();
    }
  }

  /* ---------------------------------------- Http methods ---------------------------------------- */
  /* To get the event date */
  getEventDate(): void {
    if (!this.eventUid) {
      throw new Error('Parametri non validi');
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

  /* To get the list of tables */
  getTables(): void {
    if (!this.eventUid || !this.employeeUid) {
      throw new Error('Parametri non validi');
    }

    const that = this;
    this.tablesSubscription = this.tableService
      .getRealTimeTablesByEventUidAndEmployeeUid(
        this.eventUid,
        !this.employeeIsAdministrator ? this.employeeUid : undefined
      )
      .subscribe({
        next(data: Table[]) {
          that.tables = data;
        },
        error(error: Error) {
          that.toastService.showError(error);
        }
      });
  }

  getAssignments(): void {
    if (!this.eventUid) {
      throw new Error('Parametri non validi');
    }

    const that = this;
    this.assignmentSubscription = this.assignmentService
      .getRealTimeAssignmentsByEventUidAndEmployeeUid(
        this.eventUid,
        !this.employeeIsAdministrator ? this.employeeUid : ''
      )
      .subscribe({
        next(data: Assignment[]) {
          that.eventPersonMarked = data.reduce((acc, item) => acc + item.props.personMarked, 0);
          that.eventMaxPersonAssigned = data.reduce((acc, item) => acc + item.props.maxPersonMarkable, 0);
        },
        error(error: Error) {
          that.toastService.showError(error);
        }
      });
  }

  /* ---------------------------------------- Methods ---------------------------------------- */
  goToCreateTable(): void {
    this.router.navigate(['./null'], { relativeTo: this.route });
  }
}
