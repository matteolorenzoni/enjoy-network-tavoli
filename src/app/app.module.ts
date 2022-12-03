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
import { EventComponent } from './page/administrator/event/event.component';
import { EmployeeComponent } from './page/administrator/employee/employee.component';
import { TableComponent } from './page/administrator/table/table.component';
import { EnBottomNavigationComponent } from './components/en-bottom-navigation.component';
import { SettingComponent } from './page/setting/setting.component';

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
    EventComponent,
    EmployeeComponent,
    TableComponent,
    EnBottomNavigationComponent,
    SettingComponent
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
