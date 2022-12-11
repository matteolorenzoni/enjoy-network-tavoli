import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { fadeInAnimation, staggeredFadeInIncrement } from 'src/app/animations/animations';
import { Employee } from 'src/app/models/type';
import { ToastService } from 'src/app/services/toast.service';
import { EmployeeService } from '../../../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  animations: [fadeInAnimation, staggeredFadeInIncrement]
})
export class EmployeeListComponent {
  /* Icons */
  plusIcon = faPlus;
  filterIcon = faFilter;

  /* Employees */
  employees: Employee[] = [];

  constructor(private router: Router, private employeeService: EmployeeService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  goToCreateEmployee(): void {
    this.router.navigate(['create-item/employee/null']);
  }

  getEmployees(): void {
    this.employeeService
      .getEmployees()
      .then((data) => {
        this.employees = data;
      })
      .catch((error: Error) => {
        this.toastService.showError(error.message);
      });
  }
}
