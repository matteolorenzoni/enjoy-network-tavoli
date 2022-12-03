import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/layout/dashboard/dashboard.component';
import { SettingComponent } from 'src/app/page/setting/setting.component';
import { EmployeeComponent } from '../app/page/administrator/employee/employee.component';
import { TableComponent } from '../app/page/administrator/table/table.component';
import { EventComponent } from '../app/page/administrator/event/event.component';
import { LoginComponent } from '../app/page/login/login.component';
import { PageNotFoundComponent } from '../app/page/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'administrator',
        children: [
          { path: 'event', component: EventComponent },
          { path: 'table', component: TableComponent },
          { path: 'employee', component: EmployeeComponent },
          { path: 'setting', component: SettingComponent },
          { path: '', redirectTo: 'event', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'administrator', pathMatch: 'full' }
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
