/** Angular Imports */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/** Custom Services */
import { Logger } from '../logger/logger.service';
import { AuthenticationService } from './authentication.service';
import { KeycloakAuthService } from './keycloak.service';

/** Environment Configuration */
import { environment } from '../../../environments/environment';

/** Initialize logger */
const log = new Logger('AuthenticationGuard');

/**
 * Route access authorization.
 */
@Injectable()
export class AuthenticationGuard  {

  /**
   * @param {Router} router Router for navigation.
   * @param {AuthenticationService} authenticationService Authentication Service.
   * @param {KeycloakAuthService} keycloakAuthService Keycloak Auth Service.
   */
  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private keycloakAuthService: KeycloakAuthService) { }

  /**
   * Ensures route access is authorized only when user is authenticated, otherwise redirects to login.
   *
   * @returns {boolean} True if user is authenticated.
   */
  async canActivate(): Promise<boolean> {
    if (environment.oauth.enabled) {
      try {
        const isAuthenticated = await this.keycloakAuthService.isAuthenticated();
        if (isAuthenticated) {
          return true;
        }
      } catch (error) {
        console.warn('Keycloak authentication check failed:', error);
      }
      
      // If not authenticated, redirect to login
      this.keycloakAuthService.login();
      return false;
    } else {
      try {
        const isAuthenticated = await this.authenticationService.isAuthenticated();
        if (isAuthenticated) {
          return true;
        }
      } catch (error) {
        console.warn('Authentication check failed:', error);
      }

      this.authenticationService.logout();
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
  }

}
