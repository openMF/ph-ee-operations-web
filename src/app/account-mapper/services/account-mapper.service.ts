import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountMapperService {

  apiPrefix: string = environment.backend.account;

  constructor(private http: HttpClient) { }

  /**
   * @returns {Observable<any>} Users data
   */
  getAccounts(page: number, size: number, orderBy: string, sortOrder: string): Observable<any> {
    const httpParams = new HttpParams()
    .set('page', page)
    .set('size', size)
    .set('sortOrder', sortOrder)
    .set('orderBy', orderBy);

    return this.http.get(this.apiPrefix + '/beneficiaries', { params: httpParams });
  }

}
