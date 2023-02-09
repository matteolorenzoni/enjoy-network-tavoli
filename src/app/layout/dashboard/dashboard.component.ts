import { UserService } from 'src/app/services/user.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { faCalendarDay, faChartPie, faGear, faQrcode, faUsers } from '@fortawesome/free-solid-svg-icons';
import { BottomNavigation } from 'src/app/models/type';
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
      icons: [
        { link: '/dashboard/administrator/events', name: 'Eventi', definition: faCalendarDay },
        { link: '/dashboard/administrator/employees', name: 'Dipendenti', definition: faUsers },
        { link: '/dashboard/administrator/statistics', name: 'Statistiche', definition: faChartPie },
        { link: '/dashboard/administrator/setting', name: 'Impostazioni', definition: faGear }
      ]
    },
    {
      role: RoleType.PR,
      icons: [
        { link: '/dashboard/pr/events', name: 'Eventi', definition: faCalendarDay },
        { link: '/dashboard/pr/setting', name: 'Impostazioni', definition: faGear }
      ]
    },
    {
      role: RoleType.INSPECTOR,
      icons: [
        { link: '/dashboard/inspector/scanner', name: 'Scanner', definition: faQrcode },
        { link: '/dashboard/inspector/setting', name: 'Impostazioni', definition: faGear }
      ]
    }
  ];
  bottomNavigation?: BottomNavigation;

  constructor(
    public sessionStorageService: SessionStorageService,
    private userService: UserService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const employeeRole = this.sessionStorageService.getEmployeeRole();

    if (!employeeRole) {
      this.userService.logout();
    }

    this.bottomNavigation = this.navigationMenuSettings.find((item) => item.role === employeeRole);
    if (!this.bottomNavigation) this.userService.logout();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
}
