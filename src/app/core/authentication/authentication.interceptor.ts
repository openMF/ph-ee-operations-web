/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

/** rxjs Imports */
import { Observable, Subject, BehaviorSubject } from 'rxjs';

/** Custom Services */
import { SettingsService } from 'app/settings/settings.service';

/** External Imports */
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

  /** Key to store user data in storage. */
  private oAuthUserDetailsStorageKey = 'pheeOAuthUserDetails';
  private getStoreageItem(key: string): string {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  }

  getInstitueId(): string {
    const userData = JSON.parse(this.getStoreageItem(this.oAuthUserDetailsStorageKey));
    return userData.govtId || userData.fspId || '';
  }
  getUserType(): string {
    return JSON.parse(this.getStoreageItem(this.oAuthUserDetailsStorageKey)).userType;
}
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
        if(this.getUserType()==='Govt. Entity User') {
        httpOptions.headers['x-registering-institution-id'] = this.getInstitueId();
        }
        if(this.getUserType()==='FSP User') {
          httpOptions.headers['x-banking-institution-Code'] = this.getInstitueId();
        }
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
