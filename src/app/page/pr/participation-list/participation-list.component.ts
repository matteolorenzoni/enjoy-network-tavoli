import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { fadeInAnimation, staggeredFadeInIncrement } from 'src/app/animations/animations';
import { PartecipationAndClient } from '../../../models/type';

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
  partitipationsAndClientArray: PartecipationAndClient[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.tableUid = this.route.snapshot.paramMap.get('tableUid');

    /* Check if the parameters are valid */
    if (!this.tableUid) {
      throw new Error('Errore: parametri non validi');
    }
  }

  goToCreateClient(): void {
    this.router.navigate([`create-item/${this.tableUid}/client/null`]);
  }
}
