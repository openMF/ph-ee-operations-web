/** Angular Routes */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  // getRequestToPay(requestId: string): Observable<any> {
  //   return this.http.get(`/api/v1/transactionRequests/${requestId}`);
  // }

  getRequestToPay(id: string): Observable<any> {
    return this.http
        .disableApiPrefix()
        .get('/assets/mock/payment-hub/transaction-details.mock.json');
  }

}
