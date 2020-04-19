/** Angular Routes */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Custom Models */
import { Transactions } from '../model/transaction.model';
import { TransactionDetails } from '../model/transaction-details.model';
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
export class TransactionsService {
  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * Gets all the filtered transactions.
   *
   * TODO: To be replaced once API is available.
   */
  getTransactions(fields: any, page: number, count: number): Observable<Transactions> {
    let params = '';
    fields.forEach((field: any) => {
      if (field.value !== undefined && field.value !== null && field.value !== '') {
        params += field.type + '=' + field.value + '&';
      }
    });
    params += 'page=' + page + '&size=' + count;
    // return this.http
    //   .disableApiPrefix()
    //   .get('/assets/mock/payment-hub/transactions.mock.json?' + params)
    //   .pipe(map((transactions: any) => transactions as Transactions));
    return this.http
      .disableApiPrefix()
      .get('http://large-dfsp-operator.mifos.io/transactions?' + params)
      .pipe(map((transactions: any) => transactions as Transactions));
  }

  getDfspEntries(): Observable<DfspEntry[]> {
    return this.http
      .disableApiPrefix()
      .get('/assets/mock/payment-hub/dfsp-entries.mock.json')
      .pipe(map((entries: any) => entries as DfspEntry[]));
  }

  /**
   * Get details of a Transaction.
   *
   * TODO: Mock data to be replaced once API is available.
   */
  getTransactionDetail(id: string): Observable<TransactionDetails> {
    // return this.http
    //   .disableApiPrefix()
    //   .get('/assets/mock/payment-hub/transaction-details.mock.json')
    //   .pipe(map((transaction: TransactionDetails) => transaction as TransactionDetails));
    return this.http
      .disableApiPrefix()
      .get('http://large-dfsp-operator.mifos.io/transaction/' + id)
      .pipe(map((transaction: any) => transaction as TransactionDetails));
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
