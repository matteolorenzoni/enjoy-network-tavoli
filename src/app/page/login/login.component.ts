import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { loginFormAnimation, loginFormAnimation2 } from 'src/app/animations/animations';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [loginFormAnimation, loginFormAnimation2]
})
export class LoginComponent implements OnInit {
  /** Section to display */
  section = 0;

  constructor(private router: Router, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    sessionStorage.clear();
  }

  incrementSection() {
    this.section += 1;
  }

  goToDashboard() {
    const employeeRole = this.employeeService.getEmployeeRole();
    if (employeeRole) {
      this.router.navigate([`./dashboard/${employeeRole}`]);
    }
  }
}
