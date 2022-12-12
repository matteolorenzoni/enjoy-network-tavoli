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
import { AppRoutingModule } from '../router/app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './page/login/login.component';
import { PageNotFoundComponent } from './page/page-not-found/page-not-found.component';
import { LoginFormComponent } from './page/login/login-form/login-form.component';
import { EnButtonComponent } from './components/en-button.component';
import { EnFieldComponent } from './components/en-field.component';
import { environment } from '../environments/environment';
import { EnToastComponent } from './components/en-toast.component';
import { HeroComponent } from './page/hero/hero.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { EventListComponent } from './page/administrator/event/event-list/event-list.component';
import { TableComponent } from './page/administrator/table/table.component';
import { EnBottomNavigationComponent } from './components/en-bottom-navigation.component';
import { SettingComponent } from './page/setting/setting.component';
import { EventGeneratorComponent } from './page/administrator/event/event-generator/event-generator.component';
import { CreateItemComponent } from './layout/create-item/create-item.component';
import { EnFileLoaderComponent } from './components/en-file-loader.component';
import { EnItemEventComponent } from './components/en-item-event.component';
import { StatisticsComponent } from './page/statistics/statistics.component';
import { EmployeeListComponent } from './page/administrator/employee/employee-list/employee-list.component';
import { EmployeeGeneratorComponent } from './page/administrator/employee/employee-generator/employee-generator.component';
import { EnItemEmployeeComponent } from './components/en-item-employee.component';
import { EnItemEventEmployeeComponent } from './components/en-item-event-employee.component';
import { EnCountdownComponent } from './components/en-countdown.component';
import { EmployeeListComponent as EventEmployeeListComponent } from './page/administrator/event/employee-list/employee-list.component';
import { TableListComponent as EventTableListComponent } from './page/administrator/event/table-list/table-list.component';

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
    EmployeeListComponent,
    EmployeeGeneratorComponent,
    EnItemEmployeeComponent,
    EventTableListComponent,
    EventEmployeeListComponent,
    EnItemEventEmployeeComponent,
    EnCountdownComponent
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
