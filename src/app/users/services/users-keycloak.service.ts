/** Angular Imports */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

//Rxjs Imports
import { Observable} from 'rxjs';
import { switchMap } from 'rxjs/operators';

//Environment
import { environment } from 'environments/environment';

//Custom Models
import { Role } from '../models/user.model';

/**
 * Keycloak Admin Service
 */
@Injectable({
  providedIn: 'root',
})
export class KeycloakAdminService {

  /**
   * Constructor
   * @param {HttpClient} http Http
   */
  constructor(private http: HttpClient) { }

  /**
   * @description Get url
   * @returns {string} url
   */
  private url(): string {
    return `${environment.oauth.serverUrl}/admin/realms/${environment.oauth.realm}`;
  }

  /**
   * @description Get token
   * @returns {string | null} token
   */
  private getToken(): string | null {
    const tokenDetails = sessionStorage.getItem('pheeOAuthTokenDetails');
    if (tokenDetails) {
      const token = JSON.parse(tokenDetails);
      return token.access_token;
    }
    return null;
  }


  /**
   * @description Get httpOptions
   * @returns {HttpHeaders} httpOptions
   */
  private httpOptions() {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token available');
    }
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  /**
    * @description Create user
    * @param user 
    * @returns {Observable<any>}
    */
  createUser(user: any): Observable<any> {
    const url = `${this.url()}/users`;
    return this.http.post(url, user, this.httpOptions());
  }

  /**
   * @description Update user
   * @param userId 
   * @param user 
   * @returns {Observable<any>}
   */
  updateUser(userId: string, user: any): Observable<any> {
    const url = `${this.url()}/users/${userId}`;
    return this.http.put(url, user, this.httpOptions());
  }

  /**
   * @description Get all users
   * @returns {Observable<any>}
   */
  getAllUsers(): Observable<any> {
    const url = `${this.url()}/users`;
    return this.http.get(url, this.httpOptions());
  }

  // /**
  //  * @description Get all enabled users
  //  * @returns {Observable<any>}
  //  */
  // getAllEnabledUsers(): Observable<any> {
  //   const url = `${this.url()}/users?enabled=true`;
  //   return this.http.get(url, this.httpOptions());
  // }

  // /**
  //  * @description Get all disabled users
  //  * @returns {Observable<any>}
  //  */
  // getAllDisabledUsers(): Observable<any> {
  //   const url = `${this.url()}/users?enabled=false`;
  //   return this.http.get(url, this.httpOptions());
  // }

  /**
   * @description Get user by id
   * @param userId 
   * @returns {Observable<any>}
   */
  getUserById(userId: string): Observable<any> {
    const url = `${this.url()}/users/${userId}`;
    return this.http.get(url, this.httpOptions());
  }

  /**
   * @description Delete user
   * @param userId 
   * @returns {Observable<any>}
   */
  deleteUser(userId: string): Observable<any> {
    const url = `${this.url()}/users/${userId}`;
    return this.http.delete(url, this.httpOptions());
  }

  // /**
  //  * @description Enable user
  //  * @param userId 
  //  * @returns {Observable<any>}
  //  */
  // approveUser(userId: string): Observable<any> {
  //   const updateUserUrl = `${this.url()}/users/${userId}`;
  //   const userUpdateData = { enabled: true };
  //   return this.http.put(updateUserUrl, userUpdateData, this.httpOptions());
  // }

  // /**
  //  * @description Disable user
  //  * @param userId 
  //  * @returns {Observable<any>}
  //  */
  // disableUser(userId: string): Observable<any> {
  //   const updateUserUrl = `${this.url()}/users/${userId}`;
  //   const userUpdateData = { enabled: false };
  //   return this.http.put(updateUserUrl, userUpdateData, this.httpOptions());
  // }

  /**
   * @description Update user status
   * @param userId 
   * @param newStatus 
   * @returns {Observable<any>}
   */
  updateUserStatus(userId: string, newStatus: any): Observable<any> {
    return this.getUserById(userId).pipe(
      switchMap((user: any) => {
        user.attributes.status = newStatus;
        return this.updateUser(userId, user);
      })
    );
  }

  /**
   * @description Get all roles
   * @returns {Observable<any>}
   */
  getAllRoles(): Observable<any> {
    const url = `${this.url()}/clients/${environment.oauth.clientUUID}/roles`;
    return this.http.get(url, this.httpOptions());
  }

  /**
   * @description Get user by username
   * @param username
   * @returns {Observable<any>}
    */
  getUserByUsername(username: string): Observable<any> {
    const url = `${this.url()}/users?username=${encodeURIComponent(username)}`;
    return this.http.get(url, this.httpOptions());
  }

  /**
   * @description Get role by name
   * @param roleName 
   * @returns {Observable<Role>}
   */
  getRoleByName(roleName: string): Observable<Role> {
    const url = `${this.url()}/clients/${environment.oauth.clientUUID}/roles/${roleName}`;
    return this.http.get<Role>(url, this.httpOptions());
  }

  /**
   * @description Get roles by user id
   * @param userId 
   * @returns {Observable<any>}
   */
  getRolesByUserId(userId: string): Observable<any> {
    const url = `${this.url()}/users/${userId}/role-mappings/clients/${environment.oauth.clientUUID}`;
    return this.http.get(url, this.httpOptions());
  }

  /**
   * @description Assign role to user
   * @param userId 
   * @param roleName
   * @returns {Observable<any>} 
   */
  assignRoleToUser(userId: string, roleName: any): Observable<any> {
    const url = `${this.url()}/users/${userId}/role-mappings/clients/${environment.oauth.clientUUID}`;

    return this.http.post(url, [roleName], this.httpOptions());
  }

  /**
   * @description Unassign a role from a user
   * @param userId 
   * @param roleName 
   * @returns {Observable<any>}
   */
  unassignRoleFromUser(userId: string, roleName: any): Observable<any> {
    const url = `${this.url()}/users/${userId}/role-mappings/clients/${environment.oauth.clientUUID}`;
    const options = {
      ...this.httpOptions(),
      body: roleName,
    };
    return this.http.delete(url, options);
  }

  /**
   * @description Update user password
   * @param userId 
   * @param password 
   */
  updatePassword(userId: string, password: string): Observable<any> {
    const url = `${this.url()}/users/${userId}/reset-password`;
    const data = { type: 'password', value: password, temporary: false };
    return this.http.put(url, data, this.httpOptions());
  }
}
