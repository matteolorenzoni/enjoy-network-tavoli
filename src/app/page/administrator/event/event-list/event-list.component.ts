import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { floatingButtonAnimation } from 'src/app/animations/animations';

@Component({
  selector: 'app-event',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  animations: [floatingButtonAnimation]
})
export class EventListComponent implements OnInit {
  /* Icons */
  plusIcon = faPlus;

  constructor() {
    // do nothing
  }

  ngOnInit(): void {
    console.log('qui scarico la lista di eventi gia creati');
  }

  goToCreateEvent(): void {
    console.log('qui vado alla pagina di creazione evento');
  }
}
