/** Angular Imports */
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

/** rxjs Imports */
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { KeycloakAuthService } from './keycloak.service';

import { environment } from '../../../environments/environment';

/** Http request options headers. */
const httpOptions = {
  headers: {} as { [key: string]: any }
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

  constructor(private router: Router, private authService: AuthenticationService, private keycloakAuthService: KeycloakAuthService) { }

  /**
   * Intercepts a Http request and sets the request headers.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    /**  if (request.url.indexOf('assets') !== -1) {
     *   return EMPTY;
     * }
     */

    // Skip authentication for asset requests and OAuth token requests
    if (request.url.indexOf('assets') !== -1 || 
        request.url.indexOf('/oauth/token') !== -1 ||
        request.url.indexOf('keycloak') !== -1 ||
        request.url.indexOf('accounts.integration.oneacrefund.org') !== -1) {
      return next.handle(request);
    }

    this.retrieveAuthData();
    if (!environment.auth.enabled) {
      return next.handle(this.injectToken(request));
    }

    if (request.url.indexOf('/oauth/token') !== -1) {
      return next.handle(this.injectToken(request));
    }
    if (!this.authService.isLoggedIn) {
      this.removeAuthorization();
    }

    if (!request.url.startsWith('/') && this.accessExpired) {
      if (!this.refreshTokenInProgress) {
        this.refreshTokenInProgress = true;
        this.refreshTokenSubject.next(null);
        return this.authService.refreshOAuthAccessToken().pipe(
          catchError(err => {
          
            this.authService.logout();
            this.router.navigate(['/login'], { replaceUrl: true });
            return throwError(err);
          }),
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
    
    if (environment.oauth.enabled) {
      try {
        const authHeader = this.keycloakAuthService.getAuthorizationHeader();
        this.setAuthorization(authHeader);
      } catch (error) {
        console.warn('Keycloak not ready yet, skipping authorization header');
        this.setAuthorization('');
      }
    } else {
      this.setAuthorization(this.authService.getAuthorizationToken());
    }
    
    this.setAccessExpired(this.authService.isRefreshAccessToken());
  }

  injectToken(request: HttpRequest<any>) {
    return request.clone({ setHeaders: httpOptions.headers });
  }

  setTenantId(tenantId: String) {
    if (tenantId) {
      httpOptions.headers['Platform-TenantId'] = tenantId;
    } else {
      delete httpOptions.headers["Platform-TenantId"];

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
