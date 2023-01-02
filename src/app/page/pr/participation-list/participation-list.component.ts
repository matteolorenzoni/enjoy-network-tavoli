import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { fadeInAnimation, staggeredFadeInIncrement } from 'src/app/animations/animations';
import { ToastService } from 'src/app/services/toast.service';
import { ClientService } from 'src/app/services/client.service';
import { PartecipationAndClient, Participation } from '../../../models/type';
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

  /* Table */
  tableUid: string | null = null;

  /* Client */
  participationsAndClientArray: PartecipationAndClient[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private participationService: ParticipationService,
    private clientService: ClientService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.tableUid = this.route.snapshot.paramMap.get('tableUid');

    this.getData();
  }

  getData(): void {
    /* Check if the parameters are valid */
    if (!this.tableUid) {
      throw new Error('Errore: parametri non validi');
    }

    this.getParticipations(this.tableUid);
  }

  getParticipations(tableUid: string): void {
    this.participationService
      .getParticipationsByTableUid(tableUid)
      .then((participations) => {
        this.getClientsFromParticipants(participations);
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });
  }

  getClientsFromParticipants(participations: Participation[]): void {
    const participationsUids = participations.map((item) => item.participationDTO.clientUid);
    this.clientService
      .getClientsByUids(participationsUids)
      .then((clients) => {
        this.participationsAndClientArray = [];
        clients.forEach((client) => {
          const participation = participations.find((item) => item.participationDTO.clientUid === client.uid);
          if (participation) {
            this.participationsAndClientArray.push({ participation, client });
          }
        });
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });
  }

  goToCreateClient(): void {
    this.router.navigate([`create-item/${this.tableUid}/client/null`]);
  }

  handleParticipationChange(param: { partecipationUid: string; hasPayed: boolean }): void {
    this.participationService
      .updateParticipationPaymentProp(param.partecipationUid, param.hasPayed)
      .then(() => {
        this.getData();
        this.toastService.showSuccess('Pagamento aggiornato');
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });
  }
}
