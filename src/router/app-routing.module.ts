import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/layout/dashboard/dashboard.component';
import { SettingComponent } from 'src/app/page/setting/setting.component';
import { CreateItemComponent } from '../app/layout/create-item/create-item.component';
import { EventGeneratorComponent } from '../app/page/administrator/event/event-generator/event-generator.component';
import { EmployeeComponent } from '../app/page/administrator/employee/employee.component';
import { TableComponent } from '../app/page/administrator/table/table.component';
import { EventListComponent } from '../app/page/administrator/event/event-list/event-list.component';
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
          { path: 'event', component: EventListComponent, data: { animation: 'FirstPage' } },
          { path: 'table', component: TableComponent, data: { animation: 'SecondPage' } },
          { path: 'employee', component: EmployeeComponent, data: { animation: 'ThirdPage' } },
          { path: 'setting', component: SettingComponent, data: { animation: 'FourthPage' } },
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
      { path: 'event', component: EventGeneratorComponent },
      { path: '', redirectTo: 'event', pathMatch: 'full' }
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
