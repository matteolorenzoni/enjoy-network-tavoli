import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-login-logo[setStepEvent]',
  templateUrl: './login-logo.component.html',
  styleUrls: ['./login-logo.component.scss']
})
export class LoginLogoComponent {
  @Output() setStepEvent = new EventEmitter<boolean>();

  showForm() {
    this.setStepEvent.emit(true);
  }
}
