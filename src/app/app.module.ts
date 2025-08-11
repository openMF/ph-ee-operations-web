/** Angular Imports */
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

/** Keycloak Imports */
import { KeycloakAngularModule } from 'keycloak-angular';

/** Tanslation Imports */
import { TranslateModule } from '@ngx-translate/core';

/** Chart Imports */
import { NgxChartsModule } from '@swimlane/ngx-charts';

/** Environment Configuration */
import { environment } from 'environments/environment';

/** Main Component */
import { WebAppComponent } from './web-app.component';

/** Not Found Component */
import { NotFoundComponent } from './not-found/not-found.component';

/** Load config dynamically */
import { AppConfig } from './app.config';

/** Keycloak Services */
import { KeycloakAuthService } from './core/authentication/keycloak.service';

/** Custom Modules */
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { SettingsModule } from './settings/settings.module';
import { SystemModule } from './system/system.module';
import { UsersModule } from './users/users.module';
import { PaymentHubModule } from './payment-hub/paymenthub.module';


/** Main Routing Module */
import { AppRoutingModule } from './app-routing.module';

import { DatePipe } from '@angular/common';

export function initConfig(config: AppConfig) {
  return () => config.load();
}

export function initKeycloak(keycloakAuthService: KeycloakAuthService) {
  return async () => {
    try {
      await keycloakAuthService.initKeycloak();
    } catch (error) {
      console.warn('Keycloak initialization failed:', error);
    }
  };
}

/**
 * App Module
 *
 * Core module and all feature modules should be imported here in proper order.
 */
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    TranslateModule.forRoot(),
    NgxChartsModule,
    KeycloakAngularModule,
    CoreModule,
    HomeModule,
    LoginModule,
    SettingsModule,
    SystemModule,
    UsersModule,
    PaymentHubModule,
    AppRoutingModule,
  ],
  declarations: [WebAppComponent, NotFoundComponent],
  providers: [DatePipe,
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initKeycloak,
      deps: [KeycloakAuthService],
      multi: true
    }],
  bootstrap: [WebAppComponent]
})
export class AppModule { }
