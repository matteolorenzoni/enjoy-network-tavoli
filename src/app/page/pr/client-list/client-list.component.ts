import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { fadeInAnimation, staggeredFadeInIncrement } from 'src/app/animations/animations';
import { Client } from 'src/app/models/type';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
  animations: [staggeredFadeInIncrement, fadeInAnimation]
})
export class ClientListComponent implements OnInit {
  /* Icons */
  filterIcon = faFilter;
  plusIcon = faPlus;

  /* Table */
  tableUid: string | null = null;

  /* Client */
  clients: Client[] = [];

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
