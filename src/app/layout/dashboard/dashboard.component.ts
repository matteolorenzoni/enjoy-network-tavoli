import { UserService } from 'src/app/services/user.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { faCalendarDay, faChartPie, faGear, faUsers } from '@fortawesome/free-solid-svg-icons';
import { BottomNavigation, IconLink } from 'src/app/models/type';
import { SessionStorageService } from '../../services/sessionstorage.service';
import { RoleType } from '../../models/enum';

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
      name: 'Amministratore',
      icons: [
        { link: '/dashboard/administrator/event', name: 'Eventi', definition: faCalendarDay },
        { link: '/dashboard/administrator/employee', name: 'Dipendenti', definition: faUsers },
        { link: '/dashboard/administrator/statistics', name: 'Statistiche', definition: faChartPie },
        { link: '/dashboard/administrator/setting', name: 'Impostazioni', definition: faGear }
      ]
    }
  ];
  navigationMenu: IconLink[] = [];

  constructor(
    public sessionStorageService: SessionStorageService,
    private userService: UserService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const employeeRole = this.sessionStorageService.getEmployeeRole();
    if (employeeRole) {
      this.navigationMenu = this.navigationMenuSettings.find((item) => item.role === employeeRole)?.icons || [];
    } else {
      this.userService.logout();
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
}
