import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginContext } from '../login-context.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { OAuth2Token } from '../o-auth2-token.model';

@Injectable({
  providedIn: 'root'
})
export class OauthKeycloakService {

  constructor(private http: HttpClient) { }

  token(loginContext: LoginContext): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    const payload = new URLSearchParams();
    payload.set('grant_type', 'password');
    payload.set('client_id', environment.oauth.clientId);
    if (environment.oauth.clientSecret !== '') {
      payload.set('client_secret', environment.oauth.clientSecret);
    }
    payload.set('username', loginContext.username);
    payload.set('password', loginContext.password);

    const url: string = this.url() + '/token';
    return this.http.post(url, payload.toString(), httpOptions);
  }

  refreshToken(token: OAuth2Token): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    const payload = new URLSearchParams();
    payload.set('grant_type', 'refresh_token');
    payload.set('client_id', environment.oauth.clientId);
    if (environment.oauth.clientSecret !== '') {
      payload.set('client_secret', environment.oauth.clientSecret);
    }
    payload.set('refresh_token', token.refresh_token);

    const url: string = this.url() + '/token';
    return this.http.post(url, payload.toString(), httpOptions);
  }

  introspect(token: OAuth2Token): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    const payload = new URLSearchParams();
    payload.set('client_id', environment.oauth.clientId);
    if (environment.oauth.clientSecret !== '') {
      payload.set('client_secret', environment.oauth.clientSecret);
    }
    payload.set('token', token.access_token);

    const url: string = this.url() + '/token/introspect';
    return this.http.post(url, payload.toString(), httpOptions);
  }

  logout(token: OAuth2Token): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    const payload = new URLSearchParams();
    payload.set('client_id', environment.oauth.clientId);
    if (environment.oauth.clientSecret !== '') {
      payload.set('client_secret', environment.oauth.clientSecret);
    }
    payload.set('refresh_token', token.refresh_token);

    const url: string = this.url() + '/logout';
    return this.http.post(url, payload.toString(), httpOptions);
  }

  private url(): string {
    return `${environment.oauth.serverUrl}/realms/${environment.oauth.realm}/protocol/openid-connect`;
  }

}
