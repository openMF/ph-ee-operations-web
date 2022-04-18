/** Angular Routes */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestPays } from '../model/requestPay.model'
import {RequestPayDetails} from '../model/requestPay-details.model'
@Injectable({
  providedIn: 'root'
})
export class RequestToPayService {

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }

  getRequestsToPay() {
    return this.http.get('/api/v1/transactionRequests');
  }

  getRequestToPay(requestId: string): Observable<any> {
    return this.http.get(`/api/v1/transactionRequest/${requestId}`);
  }
  getRequests(fields: any, page: number, count: number): Observable<RequestPays> {
    let params = '';
    fields.forEach((field: any) => {
      if (field.value !== undefined && field.value !== null && field.value !== '') {
        params += field.type + '=' + field.value + '&';
      }
    });
    params += 'page=' + page + '&size=' + count;
    return this.http.get('/api/v1/transactionRequests?' + params).pipe(map((requestPays: any) => requestPays as RequestPays));
  }
  getRequestDetail(id: string): Observable<RequestPayDetails> {
    return this.http.get('/api/v1/transfer/' + id).pipe(map((transaction: any) => transaction as RequestPayDetails));
  }
  // getRequestToPay(id: string): Observable<any> {
  //   return this.http
  //     .disableApiPrefix()
  //     .get('/assets/mock/payment-hub/transaction-details.mock.json');
  // }

}
