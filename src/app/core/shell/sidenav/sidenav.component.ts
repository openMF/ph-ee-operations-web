/** Angular Imports */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

/** Custom Services */
import { AuthenticationService } from '../../authentication/authentication.service';

/**
 * Sidenav component.
 */
@Component({
  selector: 'mifosx-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  //User Management Expansion
  isUserManagementExpanded:boolean = false;
  //User Management Active Button
  activeButton:string='';

  /** True if sidenav is in collapsed state. */
  @Input() sidenavCollapsed: boolean;
  @Output() sideNavControl: EventEmitter<boolean> = new EventEmitter;
  /** Username of authenticated user. */
  username: string;

  /**
   * @param {Router} router Router for navigation.
   * @param {AuthenticationService} authenticationService Authentication Service.
   */
  constructor(private router: Router,
    private authenticationService: AuthenticationService) { }

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
    this.authenticationService.logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  sideNavCollapsed(value: boolean): void {
    this.sideNavControl.emit(value);
  }
  toggleUserManagement(event: Event) {
    event.stopPropagation(); 
    this.isUserManagementExpanded = !this.isUserManagementExpanded;
  }
  setActiveButton(buttonName: string) {
    this.activeButton = buttonName;
  }

}
