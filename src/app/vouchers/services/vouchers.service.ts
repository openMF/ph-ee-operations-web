import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VouchersService {

  apiPrefix: string = environment.backend.vouchers;

  constructor(private http: HttpClient) { }

  /**
   * @returns {Observable<any>} Users data
   */
  getVouchers(page: number, size: number, orderBy: string, sortOrder: string): Observable<any> {
    const httpParams = new HttpParams()
    .set('page', page)
    .set('size', size);

    return this.http.get(this.apiPrefix + '/vouchers', { params: httpParams });
  }

  createVoucher(callbackUrl: string, payload: any): Observable<any> {
    const headers = new HttpHeaders()
    .append('x-callbackurl', callbackUrl);

    return this.http.post(this.apiPrefix + '/vouchers', payload, {headers: headers});
  }

}
