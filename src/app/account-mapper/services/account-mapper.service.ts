import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/** Environment Configuration */
import { environment } from 'environments/environment';

/**
 * Account Mapper Service
 */
@Injectable({
  providedIn: 'root'
})
export class AccountMapperService {

  apiPrefix: string = environment.backend.account;

  /**
   * @param {HttpClient} http HttpClient
   */
  constructor(private http: HttpClient) { }

  /**
   * @param {number} page Page number
   * @param {number} size Page size
   * @param {string} orderBy Order by
   * @param {string} sortOrder Sort order
   * @returns {Observable<any>} Users data
   */
  getAccounts(page: number, size: number, orderBy: string, sortOrder: string): Observable<any> {
    const httpParams = new HttpParams()
    .set('page', page)
    .set('pageSize', size)
    .set('sortOrder', sortOrder)
    .set('orderBy', orderBy);

    return this.http.get(this.apiPrefix + '/beneficiaries', { params: httpParams });
    // return this.http.get("../../../assets/mock/account-mapper.mock.json")
  }


  /**
   * @param {any} accountData Account data
   * @returns {Observable<any>} Account data
   */
  createAccount(accountData: any): Observable<any> {
    const headers = {
      'X-CallbackURL': environment.backend.voucherCallbackUrl,
    };
    return this.http.post(this.apiPrefix + '/beneficiary', accountData, { headers });
  }
}
