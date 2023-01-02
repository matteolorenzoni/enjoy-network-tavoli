import { SessionStorageService } from 'src/app/services/sessionstorage.service';
import { ToastService } from 'src/app/services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { fadeInAnimation, staggeredFadeInIncrement } from 'src/app/animations/animations';
import { Table } from 'src/app/models/type';
import { TableService } from '../../../../services/table.service';

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
  employeeUid: string | null = '';

  /* Event */
  eventUid: string | null = '';

  /* Table */
  tables: Table[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tableService: TableService,
    private toastService: ToastService,
    private sessionStorage: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('uid');
    this.employeeUid = this.sessionStorage.getEmployeeUid();

    if (!this.eventUid || !this.employeeUid) {
      throw new Error('Event uid is not defined');
    }

    this.tableService
      .getTableByEventUidAndEmployeeUid(this.eventUid, this.employeeUid)
      .then((tables: Table[]) => {
        console.log(tables);
        this.tables = tables;
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
      });
  }

  goToCreateTable(): void {
    this.router.navigate([`create-item/${this.eventUid}/table/null`]);
  }
}
