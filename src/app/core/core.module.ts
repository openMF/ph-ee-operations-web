/** Angular Imports */
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

/** Translation Imports */
import { TranslateModule } from '@ngx-translate/core';

/** Matomo Imports */
import { NgxMatomoRouterModule } from '@ngx-matomo/router';
import { NgxMatomoTrackerModule } from '@ngx-matomo/tracker';

/** Environment Configuration */
import { environment } from 'environments/environment';

/** Custom Services */
import { MatomoService } from './analytics/matomo.service';
import { AuthenticationService } from './authentication/authentication.service';
import { KeycloakAuthService } from './authentication/keycloak.service';
import { HttpCacheService } from './http/http-cache.service';
import { HttpService } from './http/http.service';
import { I18nService } from './i18n/i18n.service';
import { ProgressBarService } from './progress-bar/progress-bar.service';

/** Custom Guards */
import { AuthenticationGuard } from './authentication/authentication.guard';

/** Custom Interceptors */
import { AuthenticationInterceptor } from './authentication/authentication.interceptor';
import { ApiPrefixInterceptor } from './http/api-prefix.interceptor';
import { CacheInterceptor } from './http/cache.interceptor';
import { ErrorHandlerInterceptor } from './http/error-handler.interceptor';
import { ProgressInterceptor } from './progress-bar/progress.interceptor';

/** Custom Strategies */
import { RouteReusableStrategy } from './route/route-reusable-strategy';

/** Custom Modules */
import { SharedModule } from '../shared/shared.module';

/** Custom Components */
import { BreadcrumbComponent } from './shell/breadcrumb/breadcrumb.component';
import { ContentComponent } from './shell/content/content.component';
import { ShellComponent } from './shell/shell.component';
import { SidenavComponent } from './shell/sidenav/sidenav.component';
import { ToolbarComponent } from './shell/toolbar/toolbar.component';

/**
 * Core Module
 *
 * Main app shell components and singleton services should be here.
 */
@NgModule({
  imports: [
    SharedModule,
    HttpClientModule,
    TranslateModule,
    RouterModule,
    NgxMatomoTrackerModule.forRoot({
      siteId: environment.matomo.siteId,
      trackerUrl: environment.matomo.url,
      disabled: environment.matomo.disabled,
    }),
    NgxMatomoRouterModule,
  ],
  declarations: [
    ShellComponent,
    SidenavComponent,
    ToolbarComponent,
    BreadcrumbComponent,
    ContentComponent,
  ],
  exports: [
    SharedModule, // TO BE REMOVED: Once all components have replaced the core module import by shared module.
  ],
  providers: [
    AuthenticationService,
    KeycloakAuthService,
    AuthenticationGuard,
    AuthenticationInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
    I18nService,
    HttpCacheService,
    ApiPrefixInterceptor,
    ErrorHandlerInterceptor,
    CacheInterceptor,
    {
      provide: HttpClient,
      useClass: HttpService,
    },
    ProgressBarService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressInterceptor,
      multi: true,
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy,
    },
    MatomoService,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(
        `${parentModule} has already been loaded. Import Core module in the AppModule only.`
      );
    }
  }
}
