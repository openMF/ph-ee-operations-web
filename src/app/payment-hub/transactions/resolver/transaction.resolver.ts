/** Angular Imports */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { TransactionsService } from '../service/transactions.service';

/**
 * Transaction data resolver.
 */
@Injectable()
export class TransactionResolver  {

  /**
   * @param {TransactionsService} transactionsService Transactions service.
   */
  constructor(private transactionsService: TransactionsService) { }

  /**
   * Returns the transaction data.
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const transactionId = route.paramMap.get('id');
    return this.transactionsService.getTransactionDetail(transactionId);
  }

}
