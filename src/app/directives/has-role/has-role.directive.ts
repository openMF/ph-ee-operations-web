import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { environment } from 'environments/environment';

@Directive({
  selector: '[userHasRole]'
})
export class HasRoleDirective {

  public static ADMIN_ROLE = 'admin';
  public static OPERATOR_ROLE = 'operator';

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
      this.userRoles = [HasRoleDirective.ADMIN_ROLE];
    } else {
      this.userRoles = userDetails.realm_access.roles;
    }
  }

  /**
   * Evaluates the condition to show template.
   */
  @Input()
  set userHasRole(role: any) {
    if (typeof role !== 'string') {
      throw new Error('hasRole value must be a string');
    }
    /** Clear the template beforehand to prevent overlap OnChanges. */
    this.viewContainer.clear();
    /** Shows Template if user has role */
    if (this.hasRole(role)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  /**
   * Checks if user is permitted.
   * @param {string} role Role
   * @returns {true}
   * -`ALL_FUNCTIONS`: user is a Super user.
   * -`ALL_FUNCTIONS_READ`: user has all read roles and passed role is 'read' type.
   * - User has special role to access that feature.
   * @returns {false}
   * - Passed role doesn't fall under either of above given role grants.
   * - No value was passed to the has role directive.
   */
  private hasRole(role: string) {
    role = role.trim();
    if (this.userRoles.includes(HasRoleDirective.ADMIN_ROLE)) {
      return true;
    } else if (role !== '') {
        if (this.userRoles.includes(role)) {
          return true;
        } else {
          return false;
        }
    } else {
      return false;
    }
  }
}
