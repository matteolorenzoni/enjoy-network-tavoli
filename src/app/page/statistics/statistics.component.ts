import { Employee, Assignment, Event } from 'src/app/models/type';
import { Component } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { ChartDataset, ChartOptions } from 'chart.js';
import { RoleType } from 'src/app/models/enum';
import { ToastService } from '../../services/toast.service';
import { AssignmentService } from '../../services/assignment.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {
  /* Employee */
  employees: Employee[] = [];
  employeesPr: Employee[] = [];

  /* Event */
  events: Event[] = [];

  /* Assignments */
  assignments: Assignment[] = [];

  /* Chart general */
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: { arc: { borderWidth: 0 } },
    plugins: {
      legend: {
        align: 'start',
        labels: { color: '#cbd5e1' }
      }
    }
  };
  pieChartPlugins = [];
  palette: string[] = [
    '#8ecae6',
    '#219ebc',
    '#023047',
    '#9c89b8',
    '#f0a6ca',
    '#f0e6ef',
    '#ffb703',
    '#fb8500',
    '#c8d5b9',
    '#68b0ab',
    '#3c6e71',
    '#c6ac8f',
    '#936639'
  ];

  /* Chart event */
  displayChartEvent = false;
  pieChartLabelsEvent: (string | string[])[] = [];
  pieChartDatasetsEvent: ChartDataset<'pie', number[]>[] = [
    {
      data: [],
      backgroundColor: this.palette
    }
  ];

  /* Employee employee */
  displayChartEmployee = false;
  pieChartLabelsEmployee: (string | string[])[] = [];
  pieChartDatasetsEmployee: ChartDataset<'pie', number[]>[] = [
    {
      data: [],
      backgroundColor: this.palette
    }
  ];

  /* ------------------------------ Constructor ------------------------------ */
  constructor(
    private employeeService: EmployeeService,
    private eventService: EventService,
    private assignmentService: AssignmentService,
    private toastService: ToastService
  ) {}

  /* ------------------------------ Lifecycle hooks ------------------------------ */
  async ngOnInit(): Promise<void> {
    try {
      this.events = await this.eventService.getEvents();
      this.employees = await this.employeeService.getEmployees();
      this.employeesPr = this.employees.filter(
        (employee: Employee) => employee.props.role === RoleType.PR && employee.props.name !== '---'
      );
      this.assignments = await this.assignmentService.getAssignments();

      /* Chart event */
      this.events.forEach((event: Event) => {
        this.pieChartLabelsEvent.push(event.props.name);
        this.pieChartDatasetsEvent[0].data.push(
          this.assignments
            .filter((assignment: Assignment) => assignment.props.eventUid === event.uid)
            .reduce((acc: number, assignment: Assignment) => acc + assignment.props.personMarked, 0)
        );
      });
      this.displayChartEvent = true;

      /* Employee employee */
      this.employeesPr.forEach((employee: Employee) => {
        this.pieChartLabelsEmployee.push(`${employee.props.name} ${employee.props.lastName}`);
        this.pieChartDatasetsEmployee[0].data.push(
          this.assignments
            .filter((assignment: Assignment) => assignment.props.employeeUid === employee.uid)
            .reduce((acc: number, assignment: Assignment) => acc + assignment.props.personMarked, 0)
        );
      });
      this.displayChartEmployee = true;
    } catch (error: any) {
      this.toastService.showError(error);
    }
  }

  onEmployeeSelected(event: any): void {
    console.log(event);
  }
}
