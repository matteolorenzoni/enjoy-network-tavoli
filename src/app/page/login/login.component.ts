import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { loginFormAnimation, loginFormAnimation2 } from 'src/app/animations/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [loginFormAnimation, loginFormAnimation2]
})
export class LoginComponent {
  /** Section to display */
  section = 0;

  constructor(private router: Router) {}

  incrementSection() {
    this.section += 1;
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
