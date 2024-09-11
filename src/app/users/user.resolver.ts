/** Angular Imports */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { UsersService } from './services/users.service';
import { KeycloakAdminService } from './services/users-keycloak.service';

/**
 * User data resolver.
 */
@Injectable()
export class UserResolver  {

  /**
   * @param {UsersService} usersService Users service.
   */
  constructor(private keycloakAdminService: KeycloakAdminService) {}

  /**
   * Returns the user data.
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const userId = route.paramMap.get('id');
    return this.keycloakAdminService.getUserById(userId);  }
}
