import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../app/page/login/login.component';
import { PageNotFoundComponent } from '../app/page/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent,
  //   children: [
  //     { path: 'administrator', component: AdministratorComponent },
  //     { path: 'inspector', component: InspectorComponent },
  //     { path: 'pr', component: PrComponent }
  //   ]
  // },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
