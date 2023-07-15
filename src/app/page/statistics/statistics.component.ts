import { Employee, Assignment, Event } from 'src/app/models/type';
import { Component } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { ChartConfiguration, ChartDataset, ChartOptions } from 'chart.js';
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
  employeesPr: Employee[] = [];

  /* Event */
  events: Event[] = [];

  /* Assignments */
  assignments: Assignment[] = [];

  /* Chart general */
  chartOptionsPie: ChartOptions<'pie'> = {
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
  that = this;
  chartOptionsLine: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        position: 'bottom',
        grid: { color: 'rgba(100, 100, 100, 0.3)' },
        ticks: {
          color: '#cbd5e1'
        }
      },
      y: {
        position: 'left',
        beginAtZero: true,
        grid: { color: 'rgba(100, 100, 100, 0.3)' },
        ticks: { color: '#cbd5e1' }
      }
    }
  };
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
  pieChartLabelsEvent: (string | string[])[] = [];
  pieChartDatasetsEvent: ChartDataset<'pie', number[]>[] = [
    {
      data: [],
      backgroundColor: this.palette
    }
  ];

  /* Employee employee */
  pieChartLabelsEmployee: (string | string[])[] = [];
  pieChartDatasetsEmployee: ChartDataset<'pie', number[]>[] = [
    {
      data: [],
      backgroundColor: this.palette
    }
  ];

  /* Trend employee employee */
  pieChartDatasetsTrendEmployee: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        fill: true,
        tension: 0.5,
        pointBackgroundColor: '#fff',
        borderColor: '#8ecae6',
        backgroundColor: '#8ecae6'
      }
    ]
  };

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
      this.employeesPr = await this.employeeService.getEmployeesByRole(RoleType.PR);
      this.assignments = await this.assignmentService.getAssignments();

      /* Chart event */
      this.setEventChart();

      /* Employee employee */
      this.setEmployeeChart();

      /* Trend employee employee */
      this.setTrendEmployeeChart(this.employeesPr[0].uid);
    } catch (error: any) {
      this.toastService.showError(error);
    }
  }

  /* ------------------------------ Methods ------------------------------ */
  onEmployeeSelected(event: any): void {
    const { value } = event.target as HTMLSelectElement;
    this.setTrendEmployeeChart(value);
  }

  setEventChart(): void {
    this.events.forEach((event: Event) => {
      this.pieChartLabelsEvent.push(event.props.name);
      this.pieChartDatasetsEvent[0].data.push(
        this.assignments
          .filter((assignment: Assignment) => assignment.props.eventUid === event.uid)
          .reduce((acc: number, assignment: Assignment) => acc + assignment.props.personMarked, 0)
      );
    });
    this.pieChartDatasetsEvent = [...this.pieChartDatasetsEvent];
  }

  setEmployeeChart(): void {
    this.employeesPr.forEach((employee: Employee) => {
      this.pieChartLabelsEmployee.push(`${employee.props.name} ${employee.props.lastName}`);
      this.pieChartDatasetsEmployee[0].data.push(
        this.assignments
          .filter((assignment: Assignment) => assignment.props.employeeUid === employee.uid)
          .reduce((acc: number, assignment: Assignment) => acc + assignment.props.personMarked, 0)
      );
    });
    this.pieChartDatasetsEmployee = [...this.pieChartDatasetsEmployee];
  }

  setTrendEmployeeChart(employeeUid: string): void {
    console.log(employeeUid);
    // const assignmentSelected = this.assignments.filter(
    //   (assignment: Assignment) => assignment.props.employeeUid === employeeUid
    // );
    // const eventsWithAssignment: Event[] = this.events.filter((event: Event) =>
    //   assignmentSelected.find((assignment: Assignment) => assignment.props.eventUid === event.uid)
    // );
    // const labels: string[][] = [];
    // const dataSource: number[] = [];
    // assignmentSelected.forEach((assignment: Assignment) => {
    //   labels.push(
    //     this.events.find((event: Event) => event.uid === assignment.props.eventUid)?.props.name.split(' ') || []
    //   );
    //   dataSource.push(assignment.props.personMarked);
    // });
    // this.pieChartDatasetsTrendEmployee.labels = eventsWithAssignment.map((event: Event) => event.props.name.split(' '));
    // this.pieChartDatasetsTrendEmployee.datasets[0].data = dataSource;
    // this.pieChartDatasetsTrendEmployee = { ...this.pieChartDatasetsTrendEmployee };
  }
}
