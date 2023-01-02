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
import { EventActiveComponent } from 'src/app/page/pr/event-active/event-active.component';
import { TableGeneratorComponent } from 'src/app/page/pr/table-generator/table-generator.component';
import { SettingComponent } from 'src/app/page/setting/setting.component';
import { StatisticsComponent } from 'src/app/page/statistics/statistics.component';
import { ParticipationListComponent } from 'src/app/page/pr/participation-list/participation-list.component';
import { ClientGeneratorComponent } from '../app/page/pr/client-generator/client-generator.component';
import { PrActiveComponent } from '../app/page/administrator/event/pr-active/pr-active.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
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
      {
        path: 'pr',
        children: [
          { path: 'event', component: EventActiveComponent },
          { path: 'setting', component: SettingComponent },
          { path: '', redirectTo: 'event', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'administrator', pathMatch: 'full' }
    ]
  },
  {
    path: 'dashboard',
    component: CreateItemComponent,
    children: [
      {
        path: 'administrator',
        children: [
          {
            path: 'event/:uid',
            children: [
              { path: 'table', component: TableListComponent },
              { path: 'assignments', component: AssignmentListComponent },
              { path: 'pr-active', component: PrActiveComponent }
            ]
          }
        ]
      },
      {
        path: 'pr',
        children: [
          { path: 'event/:eventUid/table/:tableUid', component: ParticipationListComponent },
          { path: 'event/:uid', component: TableListComponent }
        ]
      }
    ]
  },
  {
    path: 'create-item',
    component: CreateItemComponent,
    children: [
      { path: 'event/:uid', component: EventGeneratorComponent },
      { path: 'employee/:uid', component: EmployeeGeneratorComponent },
      { path: ':eventUid/table/:uid', component: TableGeneratorComponent },
      { path: ':tableUid/client/:uid', component: ClientGeneratorComponent },
      { path: '', component: PageNotFoundComponent }
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
