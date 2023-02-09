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
import { UpdatePasswordComponent } from '../app/page/setting/update-password/update-password.component';
import { QrCodeMessageComponent } from '../app/page/client/qr-code-message/qr-code-message.component';
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
          { path: 'events', component: EventListComponent },
          { path: 'employees', component: EmployeeListComponent },
          { path: 'statistics', component: StatisticsComponent },
          { path: 'setting', component: SettingComponent },
          { path: '', redirectTo: 'events', pathMatch: 'full' }
        ]
      },
      {
        path: 'pr',
        children: [
          { path: 'events', component: EventActiveComponent },
          { path: 'setting', component: SettingComponent },
          { path: '', redirectTo: 'events', pathMatch: 'full' }
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
            path: ':eventUid',
            children: [
              { path: 'tables', component: TableListComponent },
              { path: 'assignments', component: AssignmentListComponent },
              { path: 'pr-active', component: PrActiveComponent }
            ]
          }
        ]
      },
      {
        path: 'pr',
        children: [
          {
            path: ':eventUid',
            children: [
              {
                path: 'tables',
                component: TableListComponent
              },
              {
                path: ':tableUid',
                children: [{ path: 'participations', component: ParticipationListComponent }]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: 'create-item',
    component: CreateItemComponent,
    children: [
      { path: 'event/:eventUid', component: EventGeneratorComponent },
      { path: 'employee/:employeeUid', component: EmployeeGeneratorComponent },
      { path: ':eventUid/table/:tableUid', component: TableGeneratorComponent },
      { path: ':eventUid/:tableUid/client/:clientUid', component: ClientGeneratorComponent },
      { path: 'setting/update-password', component: UpdatePasswordComponent },
      { path: '', component: PageNotFoundComponent }
    ]
  },
  {
    path: 'ticket',
    component: QrCodeMessageComponent
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
