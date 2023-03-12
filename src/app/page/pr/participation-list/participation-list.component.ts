import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { fadeInAnimation, staggeredFadeInIncrement } from 'src/app/animations/animations';
import { ToastService } from 'src/app/services/toast.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Participation } from '../../../models/type';
import { ParticipationService } from '../../../services/participation.service';

@Component({
  selector: 'app-participation-list',
  templateUrl: './participation-list.component.html',
  styleUrls: ['./participation-list.component.scss'],
  animations: [staggeredFadeInIncrement, fadeInAnimation]
})
export class ParticipationListComponent implements OnInit {
  /* Icons */
  filterIcon = faFilter;

  /* Employee */
  employeeUid = '';
  administratorUids: string[] = [];
  employeeIsAdministrator = false;

  /* Event */
  eventUid: string | null = null;
  canAddClient = false;

  /* Table */
  tableUid: string | null = null;

  /* Participation */
  participations: Participation[] = [];
  participationsSubscription!: Subscription;

  /* --------------------------------------------- Constructor --------------------------------------------- */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private participationService: ParticipationService,
    private toastService: ToastService
  ) {
    this.employeeUid = this.userService.getUserUid();
    this.administratorUids = environment.administratorUids;
    this.employeeIsAdministrator = this.administratorUids.includes(this.employeeUid);
  }

  /* --------------------------------------------- Lifecycle --------------------------------------------- */
  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');
    this.tableUid = this.route.snapshot.paramMap.get('tableUid');
    this.canAddClient = this.route.snapshot.queryParams['canAddClient'] === 'true';

    this.getData();
  }

  ngOnDestroy(): void {
    if (this.participationsSubscription) {
      this.participationsSubscription.unsubscribe();
    }
  }

  /* --------------------------------------------- HTTP Methods --------------------------------------------- */
  getData(): void {
    /* Check if the parameters are valid */
    if (!this.tableUid) {
      throw new Error('Errore: parametri non validi');
    }

    const that = this;
    this.participationsSubscription = this.participationService
      .getRealTimeParticipationsByTableUid(this.tableUid)
      .subscribe({
        next(data: Participation[]) {
          that.participations = data;
        },
        error(error: Error) {
          that.toastService.showError(error);
        }
      });
  }

  /* --------------------------------------------- Methods --------------------------------------------- */
  goToCreateClient(): void {
    this.router.navigate(['./null'], { relativeTo: this.route });
  }

  onDeleteParticipation() {
    this.canAddClient = true;
  }
}
