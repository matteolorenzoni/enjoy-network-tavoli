import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateItemComponent } from 'src/app/layout/create-item/create-item.component';
import { DashboardComponent } from 'src/app/layout/dashboard/dashboard.component';
import { EmployeeGeneratorComponent } from 'src/app/page/administrator/employee/employee-generator/employee-generator.component';
import { EmployeeListComponent } from 'src/app/page/administrator/employee/employee-list/employee-list.component';
import { AssignmentListComponent } from 'src/app/page/administrator/event/assignment-list/assignment-list.component';
import { EventGeneratorComponent } from 'src/app/page/administrator/event/event-generator/event-generator.component';
import { EventListComponent } from 'src/app/page/administrator/event/event-list/event-list.component';
import { TableListComponent } from 'src/app/page/administrator/event/table-list/table-list.component';
import { LoginComponent } from 'src/app/page/login/login.component';
import { PageNotFoundComponent } from 'src/app/page/page-not-found/page-not-found.component';
import { SettingComponent } from 'src/app/page/setting/setting.component';
import { StatisticsComponent } from 'src/app/page/statistics/statistics.component';
import { PrActiveComponent } from '../app/page/administrator/event/pr-active/pr-active.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard/administrator/event/:uid/table',
    component: TableListComponent
  },
  {
    path: 'dashboard/administrator/event/:uid/assignments',
    component: AssignmentListComponent
  },
  {
    path: 'dashboard/administrator/event/:uid/pr-active',
    component: PrActiveComponent
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
