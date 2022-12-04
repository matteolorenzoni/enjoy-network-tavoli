import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router) {
    // do nothing
  }

  ngOnInit(): void {
    console.log('qui scarico la lista di eventi gia creati');
  }

  goToCreateEvent(): void {
    this.router.navigate(['create-item/event']);
  }
}
