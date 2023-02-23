import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
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
  employeesSubscription!: Subscription;

  /* -------------------------------------- Constructor -------------------------------------- */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {}

  /* -------------------------------------- LifeCycle -------------------------------------- */
  ngOnInit(): void {
    const that = this;
    this.employeesSubscription = this.employeeService.getRealTimeAllEmployees().subscribe({
      next(data) {
        that.employees = data;
      },
      error(error: Error) {
        that.toastService.showError(error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.employeesSubscription) this.employeesSubscription.unsubscribe();
  }

  /* -------------------------------------- Methods -------------------------------------- */
  goToCreateEmployee(): void {
    this.router.navigate(['./null'], { relativeTo: this.route });
  }
}
