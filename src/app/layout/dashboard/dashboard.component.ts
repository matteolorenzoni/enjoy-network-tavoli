import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import {
  faCalendarDay,
  faChartPie,
  faGear,
  faQrcode,
  faTicket,
  faUsers,
  faUserTie
} from '@fortawesome/free-solid-svg-icons';
import { BottomNavigation } from 'src/app/models/type';
import { RoleType } from 'src/app/models/enum';

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
        { link: '/dashboard/administrator/employees', name: 'Dipendenti', definition: faUserTie },
        { link: '/dashboard/administrator/client', name: 'Clienti', definition: faUsers },
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
        { link: '/dashboard/inspector/ticket-manual-validation', name: 'Ticket', definition: faTicket },
        // { link: '/dashboard/inspector/participation-list', name: 'Tavoli', definition: faPeopleGroup },
        { link: '/dashboard/inspector/setting', name: 'Impostazioni', definition: faGear }
      ]
    }
  ];
  bottomNavigation?: BottomNavigation;

  constructor(private userService: UserService) {}

  async ngOnInit(): Promise<void> {
    const employeeRole: RoleType = await this.userService.getUserRole();
    this.bottomNavigation = this.navigationMenuSettings.find((item) => item.role === employeeRole);
  }
}
