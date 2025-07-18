/** Angular Imports */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

/** rxjs Imports */
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/** Custom Services */
import { AlertService } from '../alert/alert.service';

/** Environment Configuration */
import { environment } from '../../../environments/environment';

/** Custom Models */
import { AppConfig } from 'app/app.config';
import { Credentials } from './credentials.model';
import { LoginContext } from './login-context.model';
import { OAuth2Token } from './o-auth2-token.model';

import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

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
  private credentialsStorageKey = 'mifosXCredentials';
  /** Key to store oauth token details in storage. */
  private oAuthTokenDetailsStorageKey = 'mifosXOAuthTokenDetails';

  private refreshAccessToken = false;
  private loggedIn = false;
  private authorizationToken: String;
  private refreshTimeout: any;
  private tenantId: String = environment.auth.tenant;
  private username: String;
  private accessTokenExpirationTime = 1;

  /**
   * Initializes the type of storage and authorization headers depending on whether
   * credentials are presently in storage or not.
   * @param {HttpClient} http Http Client to send requests.
   * @param {AlertService} alertService Alert Service.
   */
  constructor(private http: HttpClient,
    private alertService: AlertService, private config: AppConfig, private router: Router) {
    this.storage = sessionStorage;

    config.load().then(value => {
      this.init();
    });

  }

  init() {
    this.rememberMe = false;
    const savedCredentials = JSON.parse(
      this.getStoreageItem(this.credentialsStorageKey)
    );

    if (!savedCredentials) {
      return;
    }

    this.setupStorageType(savedCredentials);
    this.setupAuthorizationToken(savedCredentials);
  }

  private setupStorageType(savedCredentials: any): void {
    if (savedCredentials.rememberMe) {
      this.rememberMe = true;
      this.storage = localStorage;
    }
  }

  private setupAuthorizationToken(savedCredentials: any): void {
    const oAuthTokenDetailsString = this.getStoreageItem(this.oAuthTokenDetailsStorageKey);

    if (!oAuthTokenDetailsString) {
      this.authorizationToken = `Basic ${savedCredentials.base64EncodedAuthenticationKey}`;
      return;
    }

    const oAuthTokenDetails = JSON.parse(oAuthTokenDetailsString);
    const oAuthRefreshToken = oAuthTokenDetails.refresh_token;

    if (!oAuthRefreshToken) {
      this.authorizationToken = `Basic ${savedCredentials.base64EncodedAuthenticationKey}`;
      return;
    }

    this.handleOAuthToken(savedCredentials, oAuthTokenDetails);
  }

  private handleOAuthToken(savedCredentials: any, oAuthTokenDetails: any): void {
    this.refreshAccessToken = true;
    this.authorizationToken = `Bearer ${savedCredentials.accessToken}`;

    if (this.isTokenValid(oAuthTokenDetails)) {
      const timeUntilExpiry = this.calculateTimeUntilExpiry(oAuthTokenDetails);
      this.setupTokenRefresh(timeUntilExpiry);
    } else {
      console.log('Stored token has expired or will expire soon, will refresh on next API call');
    }
  }

  private isTokenValid(oAuthTokenDetails: any): boolean {
    return oAuthTokenDetails.expires_in && oAuthTokenDetails.timestamp;
  }

  private calculateTimeUntilExpiry(oAuthTokenDetails: any): number {
    const tokenExpiry = oAuthTokenDetails.timestamp + (oAuthTokenDetails.expires_in * 1000);
    const now = Date.now();
    return Math.max(0, tokenExpiry - now);
  }

  private setupTokenRefresh(timeUntilExpiry: number): void {
    if (timeUntilExpiry > 60000) { // If more than 1 minute left
      // Token is still valid, set up refresh
      this.refreshTokenOnExpiry(Math.floor(timeUntilExpiry / 1000));
      this.refreshAccessToken = false; // Token is still valid
    }
  }

  hasAccess(permission: String): Boolean {
    const credentials = JSON.parse(this.getStoreageItem(this.credentialsStorageKey));
    const decoded = jwt_decode(credentials.accessToken) as any;
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
    //httpParams = httpParams.set('tenantIdentifier', loginContext.tenant);
    if (environment.oauth.enabled === 'true') {

      httpParams = httpParams.set('grant_type', 'password');
      if (environment.oauth.basicAuth === "true") {
        this.authorizationToken = `Basic ${environment.oauth.basicAuthToken}`;
      }
      return this.http.disableApiPrefix().post(`${environment.oauth.serverUrl}/oauth/token`, {}, { params: httpParams })
        .pipe(
          map((tokenResponse: OAuth2Token) => {
            // Add timestamp to token response for expiry calculation
            const tokenWithTimestamp = {
              ...tokenResponse,
              timestamp: Date.now()
            };
            this.storage.setItem(this.oAuthTokenDetailsStorageKey, JSON.stringify(tokenWithTimestamp));
            this.onLoginSuccess({ username: loginContext.username, accessToken: tokenResponse.access_token, authenticated: true, tenantId: loginContext.tenant } as any);
            // Set up automatic token refresh
            this.refreshTokenOnExpiry(tokenResponse.expires_in);
            return true;
          })
        );
    } else {
      return this.http.post('/authentication', {}, { params: httpParams })
        .pipe(
          map((credentials: Credentials) => {
            this.onLoginSuccess(credentials);
            return true;
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
  private getUserDetails(tokenResponse: OAuth2Token) {
    const httpParams = new HttpParams().set('access_token', tokenResponse.access_token);
    this.refreshTokenOnExpiry(tokenResponse.expires_in);
    this.http.get('/userdetails', { params: httpParams })
      .subscribe((credentials: Credentials) => {
        this.onLoginSuccess(credentials);
        if (!credentials.shouldRenewPassword) {
          this.storage.setItem(this.oAuthTokenDetailsStorageKey, JSON.stringify(tokenResponse));
        }
      });
  }

  /**
   * Sets the oauth2 token to refresh on expiry.
   * @param {number} expiresInTime OAuth2 token expiry time in seconds.
   */
  /**
   * Sets up automatic token refresh before expiry.
   * @param {number} expiresInTime OAuth2 token expiry time in seconds.
   */
  private refreshTokenOnExpiry(expiresInTime: number) {
    // Clear any existing refresh timeout
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    this.accessTokenExpirationTime = Date.now() + expiresInTime * 1000;

    // Calculate when to refresh the token (60 seconds before expiry, minimum 30 seconds)
    const refreshTime = Math.max(30, expiresInTime - 60);


    // Set up automatic refresh before token expires
    this.refreshTimeout = setTimeout(() => {

      this.refreshOAuthAccessToken().subscribe(
        (success) => {
          console.log('Token refreshed successfully');
        },
        (error) => {
          console.error('Failed to refresh token automatically:', error);
          // If refresh fails, redirect to login
          this.alertService.alert({ type: 'Session Expired', message: 'Your session has expired. Please log in again.' });
          this.logout().subscribe(() => {
            this.router.navigate(['/login']);
          });
        }
      );
    }, refreshTime * 1000);
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
        const tokenWithTimestamp = {
          ...tokenResponse,
          timestamp: Date.now()
        };
        this.storage.setItem(this.oAuthTokenDetailsStorageKey, JSON.stringify(tokenWithTimestamp));
        this.authorizationToken = `Bearer ${tokenResponse.access_token}`;
        this.refreshTokenOnExpiry(tokenResponse.expires_in);
        const credentials = JSON.parse(this.getStoreageItem(this.credentialsStorageKey));
        credentials.accessToken = tokenResponse.access_token;
        this.storage.setItem(this.credentialsStorageKey, JSON.stringify(credentials));
        return true;
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
    if (environment.oauth.enabled === 'true') {
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
    // Clear the refresh timeout
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }

    this.loggedIn = false;
    this.setCredentials();
    return of(true);
  }

  /**
   * Checks if the user is authenticated.
   * @returns {boolean} True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!(JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || this.getStoreageItem(this.credentialsStorageKey)
    ));
  }

  /**
   * Gets the user credentials.
   * @returns {Credentials} The user credentials if the user is authenticated otherwise null.
   */
  getCredentials(): Credentials | null {
    return JSON.parse(this.getStoreageItem(this.credentialsStorageKey));
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

  /**
   * Checks if a user is currently logged in.
   * @returns {boolean} True if user is logged in, false otherwise.
   */
  public isUserLoggedIn(): boolean {
    const credentials = this.getCredentials();
    return !!credentials && credentials.authenticated === true;
  }

}
