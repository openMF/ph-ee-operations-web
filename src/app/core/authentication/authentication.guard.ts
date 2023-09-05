/** Angular Imports */
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

/** Custom Services */
import { Logger } from '../logger/logger.service';
import { AuthenticationService } from './authentication.service';

/** Environment Configuration */
import {environment} from '../../../environments/environment';

import * as CryptoJS from 'crypto-js';

/** Initialize logger */
const log = new Logger('AuthenticationGuard');

/**
 * Route access authorization.
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {

  private storage: any;

  /**
   * @param {Router} router Router for navigation.
   * @param {AuthenticationService} authenticationService Authentication Service.
   */
  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
                this.storage = localStorage;
              }

  /**
   * Ensures route access is authorized only when user is authenticated, otherwise redirects to login.
   *
   * @returns {boolean} True if user is authenticated.
   */
  canActivate(): boolean {
    if (this.authenticationService.isAuthenticated()) {
      return true;
    }

    log.debug('User not authenticated, redirecting to login...');
    this.authenticationService.logout();

    //const state = this.strRandom(40);
    const codeVerifier = this.strRandom(128);

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

    return false;
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

}
