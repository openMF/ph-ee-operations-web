/** Angular Routes */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestPays } from '../model/requestPay.model'
import {RequestPayDetails} from '../model/requestPay-details.model'

import { Dates } from "../../../core/utils/dates";
@Injectable({
  providedIn: 'root'
})
export class RequestToPayService {

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient, private dateUtils: Dates) { }

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

  exportCSV(filterBy: any, filterName: string) {
    let body = new HttpParams();
    body = body.set("command", "export");
    let startFrom = this.dateUtils.formatDate(filterBy.startdate, 'yyyy-MM-dd HH:mm:ss')
    let startTo = this.dateUtils.formatDate(filterBy.enddate, 'yyyy-MM-dd HH:mm:ss')
    let state = filterBy.status;
    if (startFrom) {
      body = body.set("startFrom", startFrom);
    }
    if (state) {
      body = body.set("state", filterBy.status);
    }
    if (startTo) {
      body = body.set("startTo", startTo);
    }
    console.log(body);
    const exportURl = "/api/v1/transactionRequests?" + body;

    const postData = {
      transactionId: filterBy.transactionid ? filterBy.transactionid.split(",") : [],
      externalid: filterBy.externalid ? filterBy.externalid.split(",") : [],
      workflowinstancekey: filterBy.workflowinstancekey ? filterBy.workflowinstancekey.split(",") : [],
      errorDescription: filterBy.errordescription ? filterBy.errordescription.split(",") : [],
      payeeId: filterBy.payeeid ? filterBy.payeeid.split(",") : [],
      payerId: filterBy.payerid ? filterBy.payerid.split(",") : [],
    };

    console.log(Object.values(postData).toString().split(","));
    this.http
      .post(
        exportURl,

        JSON.stringify(postData),

        {
          responseType: "blob" as "json",
          headers: new HttpHeaders().append("Content-Type", "application/json"),
        }
      )
      .subscribe((val: Blob) => {
        console.log("POST call successful value returned in body", val);
        this.downLoadFile(val);
      });
  }
  downLoadFile(data: Blob) {
    let url = window.URL.createObjectURL(data);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == "undefined") {
      alert("Please disable your Pop-up blocker and try again.");
    }
  }
}
