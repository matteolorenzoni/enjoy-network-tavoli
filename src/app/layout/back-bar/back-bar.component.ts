import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-back-bar',
  templateUrl: './back-bar.component.html',
  styleUrls: ['./back-bar.component.scss']
})
export class BackBarComponent implements OnInit {
  /* Icons */
  backIcon = faArrowLeft;

  constructor(private location: Location) {}

  ngOnInit(): void {}

  goBack(): void {
    this.location.back();
  }
}
