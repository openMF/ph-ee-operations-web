/** Angular Imports */
import { Injectable } from '@angular/core';


/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { KeycloakAdminService } from './services/users-keycloak.service';

/**
 * Users data resolver.
 */
@Injectable()
export class UsersResolver  {

  /**
   * @param {KeycloakAdminService} keycloakAdminService Keycloak Admin Service.
   */
  constructor(private keycloakAdminService: KeycloakAdminService) {}

  /**
   * Returns the users data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.keycloakAdminService.getAllUsers();
  }

}
