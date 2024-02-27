/** Angular Imports */
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';

/** Tanslation Imports */
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

/** Chart Imports */
import { NgxChartsModule } from '@swimlane/ngx-charts';

/** Main Component */
import { WebAppComponent } from './web-app.component';

/** Not Found Component */
import { NotFoundComponent } from './not-found/not-found.component';

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

import { DatePipe, LocationStrategy } from '@angular/common';
import { VouchersModule } from './vouchers/vouchers.module';
import { AccountMapperModule } from './account-mapper/account-mapper.module';
import { KeycloakAngularModule } from 'keycloak-angular';

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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient, locationStrategy: LocationStrategy) => {
          return new TranslateHttpLoader(http, `${ window.location.protocol }//${ window.location.host }${locationStrategy.getBaseHref()}assets/translations/`, '.json');
        },
        deps: [HttpClient, LocationStrategy]
      }
    }),
    KeycloakAngularModule,
    NgxChartsModule,
    CoreModule,
    HomeModule,
    LoginModule,
    SettingsModule,
    SystemModule,
    UsersModule,
    PaymentHubModule,
    VouchersModule,
    AccountMapperModule,
    AppRoutingModule,
  ],
  declarations: [WebAppComponent, NotFoundComponent],
  providers: [
    DatePipe
  ],
  bootstrap: [WebAppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, `/assets/translations/`, '.json');
}
