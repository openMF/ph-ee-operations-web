/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

/** rxjs Imports */
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SettingsService } from 'app/settings/settings.service';

import * as uuid from 'uuid';

/** Http request options headers. */
const httpOptions = {
  headers: { }
};

/** Authorization header. */
const authorizationHeader = 'Authorization';

/**
 * Http Request interceptor to set the request headers.
 */
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private accessExpired = false;
  private refreshTokenSubject: Subject<any> = new BehaviorSubject<any>(null);

  constructor(private settingsService: SettingsService) {}

  /**
   * Intercepts a Http request and sets the request headers.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    delete httpOptions.headers['X-Correlation-ID'];
    if (this.settingsService.tenantIdentifier) {
      const url: string = request.url;
      if ((url.indexOf('/batches') > 0) || (url.indexOf('/transactions') > 0)) {
        httpOptions.headers['Platform-TenantId'] = this.settingsService.tenantIdentifier;
        if (!url.endsWith('/batches')) {
          httpOptions.headers['X-Correlation-ID'] = uuid.v4();
        }
        delete httpOptions.headers['x-registering-institution-id'];
        delete httpOptions.headers['X-CallbackURL'];
      }
      if ((url.indexOf('/vouchers') > 0) || (url.indexOf('/benefici') > 0)) {
        httpOptions.headers['x-registering-institution-id'] = environment.backend.registeringInstituionId;
        delete httpOptions.headers['X-Correlation-ID'];
        delete httpOptions.headers['Platform-TenantId'];
      }
    } else {
      delete httpOptions.headers['Platform-TenantId'];
    }
    request = request.clone({ setHeaders: httpOptions.headers });
    return next.handle(request);
  }

  retrieveAuthData() {
    // this.setTenantId(this.authService.getTenantId());
    // this.setAuthorization(this.authService.getAuthorizationToken());
    // this.setAccessExpired(this.authService.isRefreshAccessToken());
  }

  injectToken(request: HttpRequest<any>) {
    return request.clone({ setHeaders: httpOptions.headers });
  }

  setTenantId(tenantId: String) {
    if (tenantId) {
      httpOptions.headers['Platform-TenantId'] = tenantId;
    } else {
      delete httpOptions.headers['Platform-TenantId'];
    }
  }

  setAuthorization(authenticationKey: String) {
    if (authenticationKey) {
      httpOptions.headers[authorizationHeader] = authenticationKey;
    } else {
      delete httpOptions.headers[authorizationHeader];
    }
  }

  /**
   * Removes the authorization header.
   */
  removeAuthorization() {
    delete httpOptions.headers[authorizationHeader];
  }

  setAccessExpired(accessExpired: boolean) {
    this.accessExpired = accessExpired;
  }
}
