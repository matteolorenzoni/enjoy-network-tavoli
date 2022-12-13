import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/layout/dashboard/dashboard.component';
import { SettingComponent } from 'src/app/page/setting/setting.component';
import { EmployeeListComponent as EventEmployeeListComponent } from '../app/page/administrator/event/employee-list/employee-list.component';
import { TableListComponent as EventTableListComponent } from '../app/page/administrator/event/table-list/table-list.component';
import { EmployeeListComponent } from '../app/page/administrator/employee/employee-list/employee-list.component';
import { EmployeeGeneratorComponent } from '../app/page/administrator/employee/employee-generator/employee-generator.component';
import { StatisticsComponent } from '../app/page/statistics/statistics.component';
import { CreateItemComponent } from '../app/layout/create-item/create-item.component';
import { EventGeneratorComponent } from '../app/page/administrator/event/event-generator/event-generator.component';
import { EventListComponent } from '../app/page/administrator/event/event-list/event-list.component';
import { LoginComponent } from '../app/page/login/login.component';
import { PageNotFoundComponent } from '../app/page/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard/administrator/event/:uid/table',
    component: EventTableListComponent
  },
  {
    path: 'dashboard/administrator/event/:uid/employee',
    component: EventEmployeeListComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'administrator',
        children: [
          { path: 'event', component: EventListComponent },
          { path: 'employee', component: EmployeeListComponent },
          { path: 'statistics', component: StatisticsComponent },
          { path: 'setting', component: SettingComponent },
          { path: '', redirectTo: 'event', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'administrator', pathMatch: 'full' }
    ]
  },
  {
    path: 'create-item',
    component: CreateItemComponent,
    children: [
      { path: 'event/:uid', component: EventGeneratorComponent },
      { path: 'employee/:uid', component: EmployeeGeneratorComponent },
      { path: '', redirectTo: 'event/null', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
