import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-login-logo[setSectionEvent]',
  templateUrl: './login-logo.component.html',
  styleUrls: ['./login-logo.component.scss']
})
export class LoginLogoComponent {
  @Output() setSectionEvent = new EventEmitter<boolean>();

  showForm() {
    this.setSectionEvent.emit();
  }
}
