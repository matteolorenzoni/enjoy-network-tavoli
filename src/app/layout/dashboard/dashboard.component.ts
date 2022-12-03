import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { faCalendarDay, faGear, faUsers, faWineBottle } from '@fortawesome/free-solid-svg-icons';
import { BottomNavigation, IconLink } from 'src/app/models/type';
import { RoleType } from '../../models/enum';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  /* Navigation bottom */
  navigationMenuSettings: BottomNavigation[] = [
    {
      role: RoleType.ADMINISTRATOR,
      label: 'Amministratore',
      icons: [
        { link: '/dashboard/administrator/event', defination: faCalendarDay },
        { link: '/dashboard/administrator/table', defination: faWineBottle },
        { link: '/dashboard/administrator/employee', defination: faUsers },
        { link: '/dashboard/administrator/setting', defination: faGear }
      ]
    }
  ];
  navigationMenu: IconLink[] = [];

  constructor(private employeeService: EmployeeService, private serService: UserService) {}

  ngOnInit(): void {
    const employeeRole = this.employeeService.getEmployeeRole();
    if (employeeRole) {
      this.navigationMenu = this.navigationMenuSettings.find((item) => item.role === employeeRole)?.icons || [];
    } else {
      this.serService.logout();
    }
  }
}
