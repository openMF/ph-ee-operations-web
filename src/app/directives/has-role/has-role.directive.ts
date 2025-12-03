import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { environment } from 'environments/environment';

@Directive({
  selector: '[userHasRole]'
})
export class HasRoleDirective {

  public static ADMIN_MAKER = 'Admin Maker';
  public static ADMIN_CHECKER = 'Admin Checker';
  public static NORMAL_USER = 'Normal User';

  /** User Roles */
  private userRoles: any[];

  /**
   * Extracts User Roles from User Credentials
   * @param {TemplateRef} templateRef Template Reference
   * @param {ViewContainerRef} viewContainer View Container Reference
   * @param {AuthenticationService} authenticationService AuthenticationService
   */
  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              private authenticationService: AuthenticationService) {
    const userDetails = this.authenticationService.userDetails;
    if (environment.auth.enabled === 'false') {
      this.userRoles = [HasRoleDirective.NORMAL_USER];
    } else {
      this.userRoles = userDetails.resource_access.opsapp.roles;
    }
  }

  /**
   * Evaluates the condition to show template.
   */
  @Input()
  set userHasRole(roles: string[]) {
    if (!Array.isArray(roles)) {
      throw new Error('userHasRole value must be an array');
    }
    /** Clear the template beforehand to prevent overlap OnChanges. */
    this.viewContainer.clear();
    /** Shows Template if user has role */
    if (this.hasRole(roles)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  /**
   * Checks if user is permitted.
   * @param {string[]} roles Roles  
   * @returns {boolean} True if user has role
   */
  private hasRole(roles: string[]): boolean {
    return roles.some(role => this.userRoles.includes(role));
  }
}
