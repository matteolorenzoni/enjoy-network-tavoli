import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { loginFormAnimation, loginFormAnimation2 } from 'src/app/animations/animations';
import { RoleType } from 'src/app/models/enum';
import { EmployeeService } from 'src/app/services/employee.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [loginFormAnimation, loginFormAnimation2]
})
export class LoginComponent implements OnInit {
  /** Section to display */
  section = 0;

  constructor(private router: Router, private userService: UserService, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.userService.logout();
  }

  incrementSection() {
    this.section += 1;
  }

  async goToDashboard() {
    this.incrementSection();

    const employeeRole = await this.userService.getUserRole();
    this.router.navigate([
      employeeRole !== RoleType.INSPECTOR ? `./dashboard/${employeeRole}/events` : `./${employeeRole}/event-selector`
    ]);
  }
}
