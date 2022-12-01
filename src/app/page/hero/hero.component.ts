import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-hero[setSectionEvent]',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  @Output() setSectionEvent = new EventEmitter<boolean>();

  showForm() {
    this.setSectionEvent.emit();
  }
}
