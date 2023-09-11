/** Angular Routes */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Custom Models */
import { Recalls } from '../model/recall.model';
import { RecallDetails } from '../model/recall-details.model';
import { Currency } from '../model/currency.model';
import { DfspEntry } from '../model/dfsp.model';

/**
 * Payment Hub - Transactions.
 *
 * TODO: Complete functionality once API is available.
 */
@Injectable({
  providedIn: 'root',
})
export class RecallsService {
  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * Gets all the filtered recalls.
   *
   */
  getRecalls(fields: any, page: number, count: number, orderBy: string, sortOrder: string): Observable<Recalls> {
    let params = '';
    fields.forEach((field: any) => {
      if (field.value !== undefined && field.value !== null && field.value !== '') {
        params += field.type + '=' + field.value + '&';
      }
    });
    params += 'page=' + page + '&size=' + count;
    if (orderBy) {
      params += '&sortedBy=' + orderBy;
    }
    if (sortOrder) {
      params += '&sortedOrder=' + sortOrder;
    }
    const recallsObservable = this.http.get('/api/v1/recalls?' + params).pipe(map((recalls: any) => recalls as Recalls));
    return recallsObservable;
  }

  getDfspEntries(): Observable<DfspEntry[]> {
    return this.http
      .disableApiPrefix()
      .get('/assets/mock/payment-hub/dfsp-entries.mock.json')
      .pipe(map((entries: any) => entries as DfspEntry[]));
  }

  //TODO: @vector details-ből mit lehet csinálni a recall-al
  /*refund(id: string, comment: string): Observable<any> {
    return this.http.post('/api/v1/transfer/' + id + '/refund', comment);
  }

  recall(id: string): Observable<any> {
    return this.http.post('/api/v1/transfer/' + id + '/recall', "{}");
  }*/

  /**
   * Get details of a Recall.
   *
   */
  getRecallDetail(id: string): Observable<RecallDetails> {
    return this.http.get('/api/v1/transfer/' + id).pipe(map((recall: any) => recall as RecallDetails));
  }


  /**
   * Get currencies.
   *
   * TODO: Mock data to be replaced once API is available.
   */
  getCurrencies(): Observable<Currency[]> {
    return this.http
      .disableApiPrefix()
      .get('/assets/mock/payment-hub/currencies.mock.json')
      .pipe(map((currencies: any) => currencies as Currency[]));
  }
}
