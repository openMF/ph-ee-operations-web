/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';

/**
 * System service.
 */
@Injectable({
  providedIn: 'root'
})
export class SystemService {

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * @returns {Observable<any>} Fetches Roles and Permissions
   */
  getRoles(): Observable<any> {
    return this.http.get('/api/v1/roles');
  }

  /**
   * @returns {Observable<any>} Fetches Roles and Permissions
   */
  getRole(roleId: any): Observable<any> {
    return this.http.get(`/api/v1/roles/${roleId}/permissions`);
  }

  /**
   * @param role Role.
   * @param roleId Role ID.
   * @returns {Observable<any>}
   */
  updateRole(role: any, roleId: string): Observable<any> {
    return this.http.put(`/api/v1/roles/${roleId}`, role);
  }

  /**
   * @param roleID Role ID.
   * @param roleValueChanges Role value changes.
   * @returns {Observable<any>}
   */
  updateRolePermission(roleId: any, roleValueChanges: any): Observable<any> {
    return this.http.put(`/api/v1/roles/${roleId}/permissions`, roleValueChanges);
  }

  /**
   * @param roleId Role ID.
   * @returns {Observable<any>}
   */
  deleteRole(roleId: string): Observable<any> {
    return this.http.delete(`/api/v1/roles/${roleId}`);
  }

  /**
   * @param {any} role Role to be created.
   * @returns {Observable<any>}
   */
  createRole(role: any): Observable<any> {
    return this.http.post('/api/v1/roles', role);
  }

  /**
   * @param roleId Role ID.
   * @returns {Observable<any>}
   */
  enableRole(roleId: string): Observable<any> {
    const httpParams = new HttpParams().set('command', 'enable');
    return this.http.post(`/api/v1/roles/${roleId}`, {} , { params: httpParams });
  }

  /**
   * @param roleId Role ID.
   * @returns {Observable<any>}
   */
  disableRole(roleId: string): Observable<any> {
    const httpParams = new HttpParams().set('command', 'disable');
    return this.http.post(`/api/v1/roles/${roleId}`, {}, { params: httpParams });
  }

  /**
   * @param {any} filterBy Properties by which entries should be filtered.
   * @param {string} orderBy Property by which entries should be sorted.
   * @param {string} sortOrder Sort order: ascending or descending.
   * @param {number} offset Page offset.
   * @param {number} limit Number of entries within the page.
   * @returns {Observable<any>} Audit Trails.
   */
  getAuditTrails(filterBy: any, orderBy: string, sortOrder: string, offset: number, limit: number): Observable<any> {
    let httpParams = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString())
      .set('sortOrder', sortOrder)
      .set('orderBy', orderBy)
      .set('paged', 'true');
    // filterBy: actionName, entityName, resourceId, makerId, makerDateTimeFrom, makerDateTimeTo, checkerId, checkerDateTimeFrom, checkerDateTimeTo, processingResult
    filterBy.forEach(function (filter: any) {
      if (filter.value !== '') {
        httpParams = httpParams.set(filter.type, filter.value);
      }
    });
    return this.http.get('/audits', { params: httpParams });
  }

  /**
   * @param {string} auditTrailId Audit Trail ID.
   * @returns {Observable<any>}
   */
  getAuditTrail(auditTrailId: string): Observable<any> {
    return this.http.get(`/audits/${auditTrailId}`);
  }

  /**
   * @returns {Observable<any>} Audit Trail Search Template.
   */
  getAuditTrailSearchTemplate(): Observable<any> {
    return this.http.get('/audits/searchtemplate');
  }

}
