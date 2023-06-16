/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';
import {ZeebeTaskService} from './zeebe-task.service';

/** Custom Services */

/**
 * Transaction data resolver.
 */
@Injectable()
export class ZeebeTaskResolver implements Resolve<Object> {

  /**
   * @param {TransactionsService} tasksService Transactions service.
   */
  constructor(private tasksService: ZeebeTaskService) { }

  /**
   * Returns the transaction data.
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const transactionId = Number(route.paramMap.get('id'));
    return this.tasksService.getTask(transactionId);
  }

}
