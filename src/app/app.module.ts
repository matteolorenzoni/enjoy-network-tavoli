import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from '../router/app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './page/login/login.component';
import { PageNotFoundComponent } from './page/page-not-found/page-not-found.component';
import { LoginFormComponent } from './page/login/login-form/login-form.component';
import { EnButtonComponent } from './components/en-button.component';
import { EnBottomNavigationComponent } from './components/en-bottom-navigation.component';
import { EnCountdownComponent } from './components/en-countdown.component';
import { EnFieldComponent } from './components/en-field.component';
import { EnFileLoaderComponent } from './components/en-file-loader.component';
import { EnToastComponent } from './components/en-toast.component';
import { CreateItemComponent } from './layout/create-item/create-item.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { EmployeeGeneratorComponent } from './page/administrator/employee/employee-generator/employee-generator.component';
import { EventGeneratorComponent } from './page/administrator/event/event-generator/event-generator.component';
import { EventListComponent } from './page/administrator/event/event-list/event-list.component';
import { TableComponent } from './page/administrator/table/table.component';
import { HeroComponent } from './page/hero/hero.component';
import { SettingComponent } from './page/setting/setting.component';
import { StatisticsComponent } from './page/statistics/statistics.component';
import { TableListComponent } from './page/administrator/event/table-list/table-list.component';
import { AssignmentListComponent } from './page/administrator/event/assignment-list/assignment-list.component';
import { EmployeeListComponent } from './page/administrator/employee/employee-list/employee-list.component';
import { EnItemEmployeeComponent } from './components/en-item-employee.component';
import { EnItemAssignmentComponent } from './components/en-item-assignment.component';
import { EnItemEventComponent } from './components/en-item-event.component';
import { EnItemPrActiveComponent } from './components/en-item-pr-active.component';
import { PrActiveComponent } from './page/administrator/event/pr-active/pr-active.component';
import { EventActiveComponent } from './page/pr/event-active/event-active.component';
import { EnItemEventAvaibleComponent } from './components/en-item-event-avaible.component';
import { TableGeneratorComponent } from './page/pr/table-generator/table-generator.component';
import { EnItemTableComponent } from './components/en-item-table.component';
import { ClientListComponent } from './page/pr/client-list/client-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    LoginFormComponent,
    EnButtonComponent,
    EnFieldComponent,
    EnToastComponent,
    HeroComponent,
    DashboardComponent,
    EventListComponent,
    TableComponent,
    EnBottomNavigationComponent,
    SettingComponent,
    EventGeneratorComponent,
    CreateItemComponent,
    EnFileLoaderComponent,
    EnItemEventComponent,
    StatisticsComponent,
    EmployeeGeneratorComponent,
    EnItemEmployeeComponent,
    AssignmentListComponent,
    EnItemAssignmentComponent,
    TableListComponent,
    EnCountdownComponent,
    EmployeeListComponent,
    EnItemPrActiveComponent,
    PrActiveComponent,
    EventActiveComponent,
    EnItemEventAvaibleComponent,
    TableGeneratorComponent,
    EnItemTableComponent,
    ClientListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    FontAwesomeModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
