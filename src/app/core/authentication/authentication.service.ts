/** Angular Imports */
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

/** rxjs Imports */
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

/** Custom Services */
import {AlertService} from '../alert/alert.service';

/** Environment Configuration */
import {environment} from '../../../environments/environment';

/** Custom Models */
import {LoginContext} from './login-context.model';
import {Credentials} from './credentials.model';
import {OAuth2Token} from './o-auth2-token.model';
import {AppConfig} from 'app/app.config';

import jwt_decode from 'jwt-decode';
import CryptoJS from 'crypto-js';
import {Router} from '@angular/router';

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
  private tenantId: String;
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
    if (savedCredentials) {
      if (savedCredentials.rememberMe) {
        this.rememberMe = true;
        this.storage = localStorage;
      }

      const oAuthRefreshToken = JSON.parse(this.getStoreageItem(this.oAuthTokenDetailsStorageKey)).refresh_token;
      if (oAuthRefreshToken) {
        this.refreshAccessToken = true;
        this.authorizationToken = `Bearer ${oAuthRefreshToken}`;
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

  authorize() {
    //const state = this.strRandom(40);
    const codeVerifier = this.strRandom(128);

    this.storage = localStorage;

    //this.storage.set('state', state);
    this.storage.setItem('codeVerifier', codeVerifier);

    const codeVerifierHash = CryptoJS.SHA256(codeVerifier).toString(CryptoJS.enc.Base64);

    const codeChallenge = codeVerifierHash
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    const params = [
        'response_type=code',
        //'state=' + state,
        'client_id=community-app',
        'client_secret=' + environment.oauth.oauthClientSecret,
        'code_challenge=' + codeChallenge,
        'code_challenge_method=S256',
        'redirect_uri=' + encodeURIComponent(environment.oauth.oauthCallbackUrl),
    ];

    window.location.href = environment.oauth.oauthLoginUrl + '?' + params.join('&');
  }

  private strRandom(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

  /**
   * Authenticates the user.
   * @param {LoginContext} loginContext Login parameters.
   * @returns {Observable<boolean>} True if authentication is successful.
   */
  login(loginContext: LoginContext) {
    this.alertService.alert({ type: 'Authentication Start', message: 'Please wait...' });
    //this.rememberMe = loginContext.remember;
    //this.storage = this.rememberMe ? localStorage : sessionStorage;
    //this.tenantId = loginContext.tenant;
    let httpParams = new HttpParams();
    this.username = loginContext.username;
    httpParams = httpParams.set('username', loginContext.username);
    httpParams = httpParams.set('password', loginContext.password);

    if (environment.oauth.enabled === 'true') {
      this.username = loginContext.username;
      const payload = new HttpParams()
          .set('username', loginContext.username)
          .set('password', loginContext.password)
          //.set('grant_type', 'password')
          //.set('client_id', 'community-app')
          //.set('scope', 'ALL');
      // if (environment.oauth.basicAuth === 'true') {
      //   this.authorizationToken = `Basic ${environment.oauth.basicAuthToken}`;
      // }
      return this.http.disableApiPrefix().get(`${environment.oauth.serverUrl}/login`);
        /*.pipe(
          map((tokenResponse: OAuth2Token) => {
            // TODO: fix UserDetails API
            this.storage.setItem(this.oAuthTokenDetailsStorageKey, JSON.stringify(tokenResponse));
            this.onLoginSuccess({ username: loginContext.username, accessToken: tokenResponse.access_token, authenticated: true, tenantId: loginContext.tenant } as any);
            this.refreshTokenOnExpiry(tokenResponse.expires_in);
            return of(true);
          })
        );*/
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

  token(code: string) {
    this.storage = localStorage;
    const payload = new HttpParams()
          .set('client_id', 'community-app')
          .set('client_secret', environment.oauth.oauthClientSecret)
          .set('grant_type', 'authorization_code')
          .set('redirect_uri', environment.oauth.oauthCallbackUrl)
          .set('code_verifier', this.storage.getItem('codeVerifier'))
          .set('code', code)

    this.storage.removeItem('codeVerifier')
    this.storage = sessionStorage;

    return this.http.disableApiPrefix().post(`${environment.oauth.serverUrl}/oauth2/token`, payload)
        .pipe(
          map((tokenResponse: OAuth2Token) => {
            // TODO: fix UserDetails API
            this.storage.setItem(this.oAuthTokenDetailsStorageKey, JSON.stringify(tokenResponse));
            this.onLoginSuccess({ username: 'mifos', accessToken: tokenResponse.access_token, authenticated: true, tenantId: 'binx' } as any);
            this.refreshTokenOnExpiry(tokenResponse.expires_in);
            return of(true);
          })
        );
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

    const payload = new HttpParams()
        .set('refresh_token', oAuthRefreshToken)
        .set('grant_type', 'refresh_token');
      // if (environment.oauth.basicAuth === 'true') {
      //   this.authorizationToken = `Basic ${environment.oauth.basicAuthToken}`;
      // }

      return this.http.disableApiPrefix().post(`${environment.oauth.serverUrl}/oauth2/token`, payload)
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

}
