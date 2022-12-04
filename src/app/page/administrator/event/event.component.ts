import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
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
