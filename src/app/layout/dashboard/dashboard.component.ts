import { UserService } from 'src/app/services/user.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { faCalendarDay, faGear, faUsers, faWineBottle } from '@fortawesome/free-solid-svg-icons';
import { BottomNavigation, IconLink } from 'src/app/models/type';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from 'src/app/animations/animations';
import { RoleType } from '../../models/enum';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [slideInAnimation]
})
export class DashboardComponent implements OnInit {
  /* Navigation bottom */
  navigationMenuSettings: BottomNavigation[] = [
    {
      role: RoleType.ADMINISTRATOR,
      name: 'Amministratore',
      icons: [
        { link: '/dashboard/administrator/event', name: 'Eventi', defination: faCalendarDay },
        { link: '/dashboard/administrator/table', name: 'Tavoli', defination: faWineBottle },
        { link: '/dashboard/administrator/employee', name: 'Dipendenti', defination: faUsers },
        { link: '/dashboard/administrator/setting', name: 'Impostazioni', defination: faGear }
      ]
    }
  ];
  navigationMenu: IconLink[] = [];

  constructor(
    private employeeService: EmployeeService,
    private serService: UserService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const employeeRole = this.employeeService.getEmployeeRole();
    if (employeeRole) {
      this.navigationMenu = this.navigationMenuSettings.find((item) => item.role === employeeRole)?.icons || [];
    } else {
      this.serService.logout();
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getRouteAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
