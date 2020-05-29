/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

/** rxjs Imports */
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { switchMap, take, filter } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';

/** Http request options headers. */
const httpOptions = {
  headers: {}
};

/** Authorization header. */
const authorizationHeader = 'Authorization';
/** Two factor access token header. */
const twoFactorAccessTokenHeader = 'Fineract-Platform-TFA-Token';

/**
 * Http Request interceptor to set the request headers.
 */
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private accessExpired = false;
  private refreshTokenSubject: Subject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthenticationService) { }

  /**
   * Intercepts a Http request and sets the request headers.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.retrieveAuthData();
    if (request.url.indexOf('/oauth/token') !== -1) {
      return next.handle(this.injectToken(request));
    }
    if (!this.authService.isLoggedIn) {
      this.removeAuthorization();
    }
    if (this.accessExpired) {
      if (!this.refreshTokenInProgress) {
        this.refreshTokenInProgress = true;
        this.refreshTokenSubject.next(null);
        return this.authService.refreshOAuthAccessToken().pipe(
          switchMap((authResponse) => {
            this.refreshTokenInProgress = false;
            this.retrieveAuthData();
            this.refreshTokenSubject.next(true);
            return next.handle(this.injectToken(request));
          }),
        );
      } else {
        return this.refreshTokenSubject.pipe(
          filter(result => result !== null),
          take(1),
          switchMap((res) => {
            this.retrieveAuthData();
            return next.handle(this.injectToken(request));
          })
        );
      }
    } else {
      return next.handle(this.injectToken(request));
    }
  }

  retrieveAuthData() {
    this.setTenantId(this.authService.getTenantId());
    this.setAuthorization(this.authService.getAuthorizationToken());
    this.setAccessExpired(this.authService.isRefreshAccessToken());
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
