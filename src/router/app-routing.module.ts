import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { TicketComponent } from 'src/app/page/client/ticket/ticket.component';
import { EventSelectorComponent } from 'src/app/page/inspector/event-selector/event-selector.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { InspectorParticipationListComponent } from '../app/page/inspector/inspector-participation-list/inspector-participation-list.component';
import { ScannerComponent } from '../app/page/inspector/scanner/scanner.component';
import { UpdatePasswordComponent } from '../app/page/setting/update-password/update-password.component';
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
        canActivate: [AuthGuard],
        children: [
          /* Events */
          { path: 'events', component: EventListComponent },
          { path: 'events/:eventUid', component: EventGeneratorComponent },
          { path: 'events/:eventUid/tables', component: TableListComponent },
          { path: 'events/:eventUid/tables/:tableUid', component: TableGeneratorComponent },
          { path: 'events/:eventUid/tables/:tableUid/participations', component: ParticipationListComponent },
          {
            path: 'events/:eventUid/tables/:tableUid/participations/:participationUid',
            component: ClientGeneratorComponent
          },
          { path: 'events/:eventUid/assignments', component: AssignmentListComponent },
          { path: 'events/:eventUid/pr-active', component: PrActiveComponent },

          /* Employees */
          { path: 'employees', component: EmployeeListComponent },
          { path: 'employees/:employeeUid', component: EmployeeGeneratorComponent },

          /* Statistics */
          { path: 'statistics', component: StatisticsComponent },

          /* Page not found */
          { path: '**', component: PageNotFoundComponent }
        ]
      },
      {
        path: 'pr',
        canActivate: [AuthGuard],
        children: [
          { path: 'events', component: EventActiveComponent },
          { path: 'events/:eventUid/tables', component: TableListComponent },
          { path: 'events/:eventUid/tables/:tableUid', component: TableGeneratorComponent },
          { path: 'events/:eventUid/tables/:tableUid/participations', component: ParticipationListComponent },

          /* Page not found */
          { path: '**', component: PageNotFoundComponent }
        ]
      },
      {
        path: 'inspector',
        canActivate: [AuthGuard],
        children: [
          { path: 'participation-list', component: InspectorParticipationListComponent },
          { path: 'scanner', component: ScannerComponent },

          /* Page not found */
          { path: '**', component: PageNotFoundComponent }
        ]
      },
      { path: 'setting', component: SettingComponent },
      { path: 'setting/update-password', component: UpdatePasswordComponent },

      /* Page not found */
      { path: '**', component: PageNotFoundComponent }
    ]
  },
  {
    path: 'inspector',
    children: [
      { path: 'event-selector', component: EventSelectorComponent },
      { path: '', redirectTo: 'event-selector', pathMatch: 'full' }
    ]
  },
  {
    path: 'ticket',
    component: TicketComponent
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
