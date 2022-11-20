import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-login-logo[showFormEvent]',
  templateUrl: './login-logo.component.html',
  styleUrls: ['./login-logo.component.scss']
})
export class LoginLogoComponent {
  @Output() showFormEvent = new EventEmitter<boolean>();

  showForm() {
    this.showFormEvent.emit(true);
  }
}
