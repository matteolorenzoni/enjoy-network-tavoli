import { Component } from '@angular/core';
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  /** Icons */
  nameIcon = faUser;
  passwordIcon = faKey;
}
