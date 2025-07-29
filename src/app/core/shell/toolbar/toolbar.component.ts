/** Angular Imports */
import { animate, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

/** rxjs Imports */
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

/** Custom Services */
import { Credentials } from 'app/core/authentication/credentials.model';
import { Utils } from 'app/core/utils/utils';
import { MatomoService } from '../../analytics/matomo.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { KeycloakAuthService } from '../../authentication/keycloak.service';

/** Environment Configuration */
import { environment } from '../../../../environments/environment';

/**
 * Toolbar component. test
 */
@Component({
  selector: 'mifosx-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
      transition(':leave', [animate(500, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ToolbarComponent implements OnInit {
  authorities: string[] = [];
  credentials: Credentials;
  username$ = new BehaviorSubject<string>('Keycloak User');

  /** Subscription to breakpoint observer for handset. */
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  /** Sets the initial visibility of search input as hidden. Visible if true. */
  searchVisible = false;
  /** Sets the initial state of sidenav as collapsed. Not collapsed if false. */
  sidenavCollapsed = true;

  /** Instance of sidenav. */
  @Input() sidenav: MatSidenav;
  /** Sidenav collapse event. */
  @Output() collapse = new EventEmitter<boolean>();

  /**
   * @param {BreakpointObserver} breakpointObserver Breakpoint observer to detect screen size.
   * @param {Router} router Router for navigation.
   * @param {AuthenticationService} authenticationService Authentication service.
   * @param {KeycloakAuthService} keycloakAuthService Keycloak Auth Service.
   * @param {MatomoService} matomoService Matomo Analytics Service.
   */
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private utils: Utils,
    private authenticationService: AuthenticationService,
    private keycloakAuthService: KeycloakAuthService,
    private matomoService: MatomoService
  ) { }

  /**
   * Subscribes to breakpoint for handset.
   */
  async ngOnInit() {
    if (environment.oauth.enabled) {
      // Try to get username immediately
      this.updateUsername();
      
      // Wait a bit for Keycloak to be ready and try again
      setTimeout(() => {
        this.updateUsername();
        this.authorities = this.getUserAuthorities(this.credentials) ?? [];
      }, 1000);
    } else {
      this.credentials = this.authenticationService.getCredentials();
      this.authorities = this.getUserAuthorities(this.credentials) ?? [];
    }
    
    this.isHandset$.subscribe((isHandset) => {
      if (isHandset && this.sidenavCollapsed) {
        this.toggleSidenavCollapse(false);
      }
    });
  }

  private updateUsername() {
    try {
      const username = this.keycloakAuthService.getUsername();
      if (username && username !== 'Keycloak User') {
        this.username$.next(username);
      }
    } catch (error) {
      console.warn('Could not get Keycloak username:', error);
    }
  }

  displayUser() {
    if (environment.oauth.enabled) {
      return this.username$.value;
    } else {
      return this.credentials
        ? this.credentials.username + ' - ' + this.credentials.tenantId
        : '';
    }
  }

  /**
   * Toggles the current state of sidenav.
   */
  toggleSidenav() {
    this.sidenav.toggle();
  }

  /**
   * Toggles the current collapsed state of sidenav.
   */
  toggleSidenavCollapse(sidenavCollapsed?: boolean) {
    this.sidenavCollapsed = sidenavCollapsed || !this.sidenavCollapsed;
    this.collapse.emit(this.sidenavCollapsed);
  }

  /**
   * Toggles the visibility of search input with fadeInOut animation.
   */
  toggleSearchVisibility() {
    this.searchVisible = !this.searchVisible;
  }

  /**
   * Logs out the authenticated user and redirects to login page.
   */
  logout() {
    // Track logout event
    this.matomoService.trackLogout();

    this.authenticationService
      .logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  /**
   * Parse a user's token to get the permissions/authorities given to a user.
   */
  getUserAuthorities(credentials: Credentials) {
    if (environment.oauth.enabled) {
      try {
        const token = this.keycloakAuthService.getToken();
        if (token) {
          return this.utils.parseJwtToken(token).authorities;
        }
      } catch (error) {
        console.warn('Could not parse Keycloak token:', error);
      }
      return [];
    } else {
      if (credentials && credentials.accessToken) {
        return this.utils.parseJwtToken(credentials.accessToken).authorities;
      }
    }
    return [];
  }
}
