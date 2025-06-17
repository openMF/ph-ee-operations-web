/** Angular Imports */
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

/** Custom Services */
import { AuthenticationService } from '../../authentication/authentication.service';
import { MatomoService } from '../../analytics/matomo.service';

/**
 * Sidenav component.
 */
@Component({
  selector: 'mifosx-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  /** True if sidenav is in collapsed state. */
  @Input() sidenavCollapsed: boolean;
  /** Username of authenticated user. */
  username: string;

  /**
   * @param {Router} router Router for navigation.
   * @param {AuthenticationService} authenticationService Authentication Service.
   * @param {MatomoService} matomoService Matomo Analytics Service.
   */
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private matomoService: MatomoService
  ) {}

  /**
   * Sets the username of the authenticated user.
   */
  ngOnInit() {
    const credentials = this.authenticationService.getCredentials();
    if (credentials) {
      this.username = credentials.username;
    } else {
      this.username = 'User';
    }
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
}
