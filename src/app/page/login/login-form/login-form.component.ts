import { Component, EventEmitter, Output } from '@angular/core';
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login-form[setStepEvent]',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  @Output() setStepEvent = new EventEmitter<boolean>();

  /** Icons */
  nameIcon = faUser;
  passwordIcon = faKey;

  hideForm() {
    this.setStepEvent.emit(true);
  }
}
