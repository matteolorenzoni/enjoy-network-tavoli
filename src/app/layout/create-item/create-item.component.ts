import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { fadeInMain, slidInHeader } from 'src/app/animations/animations';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss'],
  animations: [slidInHeader, fadeInMain]
})
export class CreateItemComponent implements OnInit {
  /* Icons */
  backIcon = faArrowLeft;

  /* Route */
  pageTitle = '';

  constructor(private location: Location) {}

  ngOnInit(): void {}

  goBack(): void {
    this.location.back();
  }
}
