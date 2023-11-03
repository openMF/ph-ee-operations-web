/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';

/**
 * Users service.
 */
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * @returns {Observable<any>} Users data
   */
  getUsers(): Observable<any> {
    return this.http.get('/api/v1/users');
  }

  /**
   * @returns {Observable<any>} Users template data
   */
  getUsersTemplate(): Observable<any> {
    return this.http.get('/api/v1/roles');
  }

  /**
   * @param {any} user User to be created.
   * @returns {Observable<any>}
   */
  createUser(user: any): Observable<any> {
    return this.http.post('/api/v1/user', user);
  }

  /**
   * @param {any} id id of user to be updated.
   * @param {any} roleData Roles to be assigned.
   * @returns {Observable<any>}
   */
  assignRoles(id: any, roleData: any): Observable<any> {
    return this.http.put('/api/v1/user/' + id + '/roles?action=ASSIGN', roleData);
  }

  /**
   * @param {string} userId user ID of user.
   * @returns {Observable<any>} User.
   */
  getUser(userId: string): Observable<any> {
    return this.http.get(`/api/v1/user/${userId}`);
  }

  /**
   * @param {string} userId user ID of user.
   * @returns {Observable<any>}
   */
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`/api/v1/user/${userId}`);
  }

  /**
   * @param {string} userId user ID of user.
   * @returns {Observable<any>}
   */
  activateUser(userId: string): Observable<any> {
    return this.http.post(`/api/v1/user/${userId}/activate`, {});
  }

  /**
   * @param {string} userId user ID of user.
   * @returns {Observable<any>}
   */
  deactivateUser(userId: string): Observable<any> {
    return this.http.post(`/api/v1/user/${userId}/deactivate`, {});
  }

  /**
   * @param {any} officeId ID of office to retrieve staff from.
   * @returns {Observable<any>} Staff data.
   */
  getStaff(officeId: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('officeId', officeId.toString());
    return this.http.get('/api/v1/staff', { params: httpParams });
  }

  /**
   * @param {any} list list of allowed currencies.
   * @returns {Observable<any>}
   */
  editCurrencies(id: any, list: any): Observable<any> {
    return this.http.put('/api/v1/user/' + id + '/currencies', list);
  }

  /**
   * @param {any} list list of allowed PayeePartyIdTypes.
   * @returns {Observable<any>}
   */
  editPayeePartyIdTypes(id: any, list: any): Observable<any> {
    return this.http.put('/api/v1/user/' + id + '/payeePartyIdTypes', list);
  }

  /**
   * @param {any} list list of allowed PayeePartyIds.
   * @returns {Observable<any>}
   */
  editPayeePartyIds(id: any, list: any): Observable<any> {
    return this.http.put('/api/v1/user/' + id + '/payeePartyIds', list);
  }

  fetchAmsList(): Observable<any> {
    return this.http.get('/api/v1/ams/sources');
  }

  /**
   * @param {any} appUser user to edit
   * @returns {Observable<any>}
   */
   editUserDetails(id: any, appUser: any): Observable<any> {
    return this.http.put('/api/v1/user/' + id, appUser);
  }
}
