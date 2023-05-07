import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faFilter } from '@fortawesome/free-solid-svg-icons';
import { fadeInCreateItemAnimation, staggeredFadeInIncrement } from 'src/app/animations/animations';
import { Location } from '@angular/common';
import { Employee } from 'src/app/models/type';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../../services/employee.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-pr-active',
  templateUrl: './pr-active.component.html',
  styleUrls: ['./pr-active.component.scss'],
  animations: [fadeInCreateItemAnimation, staggeredFadeInIncrement]
})
export class PrActiveComponent implements OnInit {
  /* Icons */
  backIcon = faArrowLeft;
  filterIcon = faFilter;

  /* Event */
  eventUid?: string;

  /* Employee */
  employees: Employee[] = [];

  /* ------------------------------ Constructor ------------------------------ */

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {}

  /* ------------------------------ Lifecycle Hooks ------------------------------ */

  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid') || undefined;

    this.getData();
  }

  /* ------------------------------ HTTP Methods ------------------------------ */

  async getData() {
    if (!this.eventUid) {
      this.toastService.showErrorMessage("Errore, parametri dell'evento non validi");
      return;
    }

    try {
      this.employees = await this.employeeService.getEmployeePrAndActiveWithNoAssignment(this.eventUid);
    } catch (error: any) {
      this.toastService.showError(error);
    }
  }

  /* ------------------------------ Methods ------------------------------ */

  removeEmployeeDeleted(employeeUid: string) {
    this.employees = this.employees.filter((employee) => employee.uid !== employeeUid);
  }

  goBack(): void {
    this.location.back();
  }
}
