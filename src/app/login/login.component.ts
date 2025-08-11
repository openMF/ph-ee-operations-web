/** Angular Imports */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

/** rxjs Imports */
import { Subscription } from 'rxjs';

/** Custom Models */
import { Alert } from '../core/alert/alert.model';

/** Custom Services */
import { AlertService } from '../core/alert/alert.service';
import { KeycloakAuthService } from '../core/authentication/keycloak.service';

/** Environment Configuration */
import { environment } from '../../environments/environment';

/**
 * Login component.
 */
@Component({
  selector: 'mifosx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  /** True if password requires a reset. */
  resetPassword = false;
  /** True if user requires two factor authentication. */
  twoFactorAuthenticationRequired = false;
  /** Subscription to alerts. */
  alert$: Subscription;

  /**
   * @param {AlertService} alertService Alert Service.
   * @param {Router} router Router for navigation.
   * @param {KeycloakAuthService} keycloakAuthService Keycloak Auth Service.
   */
  constructor(private alertService: AlertService,
              private router: Router,
              private keycloakAuthService: KeycloakAuthService) { }

  /**
   * Subscribes to alert event of alert service.
   */
  ngOnInit() {
    // If OAuth is enabled, redirect to Keycloak login
    if (environment.oauth.enabled) {
      this.keycloakAuthService.login();
      return;
    }

    this.alert$ = this.alertService.alertEvent.subscribe((alertEvent: Alert) => {
      const alertType = alertEvent.type;
      if (alertType === 'Password Expired') {
        this.twoFactorAuthenticationRequired = false;
        this.resetPassword = true;
      } else if (alertType === 'Two Factor Authentication Required') {
        this.resetPassword = false;
        this.twoFactorAuthenticationRequired = true;
      } else if (alertType === 'Authentication Success') {
        this.resetPassword = false;
        this.twoFactorAuthenticationRequired = false;
        this.router.navigate(['/'], { replaceUrl: true });
      }
    });
  }

  /**
   * Unsubscribes from alerts.
   */
  ngOnDestroy() {
    this.alert$.unsubscribe();
  }

}
