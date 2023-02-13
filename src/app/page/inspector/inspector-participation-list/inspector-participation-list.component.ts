import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { staggeredFadeInIncrement } from 'src/app/animations/animations';
import { Table } from 'src/app/models/type';
import { TableService } from 'src/app/services/table.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-inspector-participation-list',
  templateUrl: './inspector-participation-list.component.html',
  styleUrls: ['./inspector-participation-list.component.scss'],
  animations: [staggeredFadeInIncrement]
})
export class InspectorParticipationListComponent {
  /* Icons */
  filterIcon = faFilter;

  /* Event */
  eventUid!: string;
  // eventPersonMarked = 0;
  // eventMaxPersonAssigned = 0;

  /* Table */
  tables: Table[] = [];

  constructor(
    private route: ActivatedRoute,
    private tableService: TableService,
    private toastService: ToastService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.eventUid = this.route.snapshot.queryParams['event'];

    if (!this.eventUid) {
      this.toastService.showErrorMessage('Nessun evento selezionato');
      this.userService.logout();
    }

    this.getTables();
  }

  /* ---------------------------------------- Http methods ---------------------------------------- */
  getTables(): void {
    this.tableService
      .getTableByEventUid(this.eventUid)
      .then((tables) => {
        this.tables = tables;
      })
      .catch((error: Error) => {
        this.toastService.showError(error);
      });
  }

  /* ---------------------------------------- Methods ---------------------------------------- */
  goToTableParticipation(tableUid: string): void {
    console.log(tableUid);
  }
}
