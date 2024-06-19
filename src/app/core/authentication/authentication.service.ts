/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/** Custom Services */
import { AlertService } from '../alert/alert.service';

/** Environment Configuration */
import { environment } from '../../../environments/environment';

/** Custom Models */
import { LoginContext } from './login-context.model';
import { Credentials } from './credentials.model';
import { Introspect, OAuth2Token } from './o-auth2-token.model';

import jwt_decode from 'jwt-decode';
import { OauthKeycloakService } from './keycloak/oauth-keycloak.service';

/**
 * Authentication workflow.
 */
@Injectable()
export class AuthenticationService {

  /** Denotes whether the user credentials should persist through sessions. */
  private rememberMe: boolean;
  /**
   * Denotes the type of storage:
   *
   * Session Storage: User credentials should not persist through sessions.
   *
   * Local Storage: User credentials should persist through sessions.
   */
  private storage: any;
  /** User credentials. */

  private credentials: Credentials;
  /** Key to store credentials in storage. */
  private credentialsStorageKey = 'pheeCredentials';
  /** Key to store oauth token details in storage. */
  private oAuthTokenDetailsStorageKey = 'pheeOAuthTokenDetails';
  /** Key to store user roles details in storage. */
  private oAuthUserDetailsStorageKey = 'pheeOAuthUserDetails';

  private refreshAccessToken = false;
  private loggedIn = false;
  private authorizationToken: String;
  private tenantId: String = environment.tenant;
  private username: String;
  private accessTokenExpirationTime = 1;

  /**
   * Initializes the type of storage and authorization headers depending on whether
   * credentials are presently in storage or not.
   * @param {HttpClient} http Http Client to send requests.
   * @param {AlertService} alertService Alert Service.
   */
  constructor(private http: HttpClient,
    private alertService: AlertService,
    private oauthKeycloakService: OauthKeycloakService) {
    this.storage = sessionStorage;

    this.init();
  }

  init() {
    this.rememberMe = false;
    const savedCredentials = JSON.parse(
      this.getStoreageItem(this.credentialsStorageKey)
    );
    if (savedCredentials) {
      if (savedCredentials.rememberMe) {
        this.rememberMe = true;
        this.storage = localStorage;
      }

      if (environment.oauth.enabled) {
        const oauthToken: OAuth2Token = JSON.parse(this.getStoreageItem(this.oAuthTokenDetailsStorageKey));
        const oAuthRefreshToken = oauthToken.refresh_token;
        if (oAuthRefreshToken) {
          this.oauthKeycloakService.introspect(oauthToken).subscribe((response: any) => {
            if (!response.active) {
              this.loggedIn = false;
              this.setCredentials();
            } else {
              this.refreshAccessToken = true;
              this.authorizationToken = `Bearer ${oAuthRefreshToken}`;
            }
          });
        }
      } else {
        this.authorizationToken = `Basic ${savedCredentials.base64EncodedAuthenticationKey}`;
      }
    }
  }

  hasAccess(permission: String): Boolean {
    const credentials = JSON.parse(this.getStoreageItem(this.credentialsStorageKey));
    const decoded = jwt_decode(credentials.accessToken);
    const authorities = decoded['authorities'];
    return authorities.includes('ALL_FUNCTIONS') || authorities.includes(permission);
  }

  /**
   * Authenticates the user.
   * @param {LoginContext} loginContext Login parameters.
   * @returns {Observable<boolean>} True if authentication is successful.
   */
  login(loginContext: LoginContext) {
    this.alertService.alert({ type: 'Authentication Start', message: 'Please wait...' });
    this.rememberMe = loginContext.remember;
    this.storage = this.rememberMe ? localStorage : sessionStorage;
    this.tenantId = loginContext.tenant;
    let httpParams = new HttpParams();
    this.username = loginContext.username;
    httpParams = httpParams.set('username', loginContext.username);
    httpParams = httpParams.set('password', loginContext.password);
    // httpParams = httpParams.set('tenantIdentifier', loginContext.tenant);
    if (environment.oauth.enabled) {
      if (this.isOauthKeyCloak()) {
        return this.oauthKeycloakService.token(loginContext).pipe(
          map((tokenResponse: OAuth2Token) => {
            this.storage.setItem(this.oAuthTokenDetailsStorageKey, JSON.stringify(tokenResponse));
            this.getUserDetails(loginContext, tokenResponse);
            return of(true);
          })
        );

      } else {

        httpParams = httpParams.set('grant_type', 'password');
        if (environment.oauth.basicAuth === 'true') {
          this.authorizationToken = `Basic ${environment.oauth.basicAuthToken}`;
        }
        return this.http.disableApiPrefix().post(`${environment.oauth.serverUrl}/oauth/token`, {}, { params: httpParams })
          .pipe(
            map((tokenResponse: OAuth2Token) => {
              this.storage.setItem(this.oAuthTokenDetailsStorageKey, JSON.stringify(tokenResponse));
              this.onLoginSuccess({ username: loginContext.username, accessToken: tokenResponse.access_token, authenticated: true, tenantId: loginContext.tenant } as any);
              return of(true);
            })
          );
      }
    } else {
      return this.http.post('/authentication', {}, { params: httpParams })
        .pipe(
          map((credentials: Credentials) => {
            this.onLoginSuccess(credentials);
            return of(true);
          })
        );
    }
  }

  /**
   * Retrieves the user details after oauth2 authentication.
   *
   * Sets the oauth2 token refresh time.
   * @param {OAuth2Token} tokenResponse OAuth2 Token details.
   */
  private getUserDetails(loginContext: LoginContext, tokenResponse: OAuth2Token) {
    if (this.isOauthKeyCloak()) {
      this.oauthKeycloakService.introspect(tokenResponse).subscribe((userDetails: Introspect) => {
        this.storage.setItem(this.oAuthUserDetailsStorageKey, JSON.stringify(userDetails));
        this.onLoginSuccess({ username: loginContext.username, accessToken: tokenResponse.access_token, authenticated: true, tenantId: loginContext.tenant } as any);

      });
    }
  }

  /**
   * Sets the oauth2 token to refresh on expiry.
   * @param {number} expiresInTime OAuth2 token expiry time in seconds.
   */
  private refreshTokenOnExpiry(expiresInTime: number) {
    this.accessTokenExpirationTime = Date.now() + expiresInTime * 1000;
    setTimeout(() => this.refreshAccessToken = true, expiresInTime * 1000);
  }

  private getStoreageItem(item: string): any {
    return sessionStorage.getItem(item) || localStorage.getItem(item);
  }

  /**
   * Refreshes the oauth2 authorization token.
   */
  public refreshOAuthAccessToken() {
    const oAuth = this.getStoreageItem(this.oAuthTokenDetailsStorageKey);
    const oAuthData = JSON.parse(oAuth);

    const oAuthRefreshToken = oAuthData.refresh_token;
    this.tenantId = JSON.parse(this.getStoreageItem(this.credentialsStorageKey)).tenantId;
    let httpParams = new HttpParams();
    httpParams = httpParams.set('grant_type', 'refresh_token');
    httpParams = httpParams.set('refresh_token', oAuthRefreshToken);

    if (environment.oauth.basicAuth === 'true') {
      this.authorizationToken = `Basic ${environment.oauth.basicAuthToken}`;
    }

    return this.http.disableApiPrefix().post(`${environment.oauth.serverUrl}/oauth/token`, {}, { params: httpParams })
      .pipe(map((tokenResponse: OAuth2Token) => {
        this.refreshAccessToken = false;
        this.storage.setItem(this.oAuthTokenDetailsStorageKey, JSON.stringify(tokenResponse));
        this.authorizationToken = `Bearer ${tokenResponse.access_token}`;
        this.refreshTokenOnExpiry(tokenResponse.expires_in);
        const credentials = JSON.parse(this.getStoreageItem(this.credentialsStorageKey));
        credentials.accessToken = tokenResponse.access_token;
        this.storage.setItem(this.credentialsStorageKey, JSON.stringify(credentials));
        return of(true);
      }));

  }

  /**
   * Sets the authorization token followed by one of the following:
   *
   * Sends an alert if password has expired and requires a reset.
   *
   * Sends an alert on successful login.
   * @param {Credentials} credentials Authenticated user credentials.
   */
  private onLoginSuccess(credentials: Credentials) {
    this.loggedIn = true;
    if (environment.oauth.enabled) {
      this.authorizationToken = `Bearer ${credentials.accessToken}`;
    } else {
      this.authorizationToken = `Basic ${credentials.base64EncodedAuthenticationKey}`;
    }

    if (credentials.shouldRenewPassword) {
      this.credentials = credentials;
      this.alertService.alert({ type: 'Password Expired', message: 'Your password has expired, please reset your password!' });
    } else {
      this.setCredentials(credentials);
      this.alertService.alert({ type: 'Authentication Success', message: `${credentials.username} successfully logged in!` });
      delete this.credentials;
    }

  }

  /**
   * Logs out the authenticated user and clears the credentials from storage.
   * @returns {Observable<boolean>} True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    this.loggedIn = false;
    if (environment.oauth.enabled) {
      if (this.isOauthKeyCloak()) {
        const oauthToken: OAuth2Token = JSON.parse(this.getStoreageItem(this.oAuthTokenDetailsStorageKey));
        if (oauthToken) {
          this.oauthKeycloakService.logout(oauthToken).subscribe((response: any) => { });
        }
      }
    }

    this.setCredentials();
    return of(true);
  }

  /**
   * Checks if the user is authenticated.
   * @returns {boolean} True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return this.loggedIn;
  }

  /**
   * Gets the user credentials.
   * @returns {Credentials} The user credentials if the user is authenticated otherwise null.
   */
  getCredentials(): Credentials | null {
    return JSON.parse(this.getStoreageItem(this.credentialsStorageKey));
  }

  get userDetails(): Introspect | null {
    return JSON.parse(this.getStoreageItem(this.oAuthUserDetailsStorageKey));
  }

  /**
   * Sets the user credentials.
   *
   * The credentials may be persisted across sessions by setting the `rememberMe` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   *
   * @param {Credentials} credentials Authenticated user credentials.
   */
  private setCredentials(credentials?: Credentials) {
    if (credentials) {
      credentials.rememberMe = this.rememberMe;
      this.storage.setItem(this.credentialsStorageKey, JSON.stringify(credentials));
      this.loggedIn = true;
    } else {
      this.storage.removeItem(this.credentialsStorageKey);
      this.storage.removeItem(this.oAuthTokenDetailsStorageKey);
      this.storage.removeItem(this.oAuthUserDetailsStorageKey);
      this.loggedIn = false;
    }
  }

  /**
   * Resets the user's password and authenticates the user.
   * @param {any} passwordDetails New password.
   */
  resetPassword(passwordDetails: any) {
    return this.http.put(`/users/${this.credentials.userId}`, passwordDetails).
      pipe(
        map(() => {
          this.alertService.alert({ type: 'Password Reset Success', message: `Your password was sucessfully reset!` });
          this.loggedIn = false;
          const loginContext: LoginContext = {
            username: this.credentials.username,
            password: passwordDetails.password,
            remember: this.rememberMe,
            tenant: this.credentials.tenantId
          };
          this.login(loginContext).subscribe();
        })
      );
  }

  isRefreshAccessToken() {
    return this.refreshAccessToken || this.accessTokenExpirationTime < Date.now();
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  getAuthorizationToken() {
    return this.authorizationToken;
  }

  getTenantId() {
    return this.tenantId;
  }

  getUsername() {
    return this.username;
  }

  isOauthKeyCloak(): boolean {
    return (environment.oauth.type === 'keycloak');
  }

}
