import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { fadeInAnimation, staggeredFadeInIncrement } from 'src/app/animations/animations';
import { ToastService } from 'src/app/services/toast.service';
import { Subscription } from 'rxjs';
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
  plusIcon = faPlus;

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
    private participationService: ParticipationService,
    private toastService: ToastService
  ) {}

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
    this.router.navigate([`create-item/${this.eventUid}/${this.tableUid}/client/null`]);
  }

  onDeleteParticipation() {
    this.canAddClient = true;
  }
}
