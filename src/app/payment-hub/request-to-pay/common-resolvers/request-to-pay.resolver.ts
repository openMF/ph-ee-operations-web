/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { RequestToPayService } from '../service/request-to-pay.service';

/**
 * Transaction data resolver.
 */
@Injectable()
export class RequestToPayResolver implements Resolve<Object> {

  /**
   * @param {RequestToPayService} requestToPayService RequestToPay Service.
   */
  constructor(private requestToPayService: RequestToPayService) { }

  /**
   * Returns the transaction data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.requestToPayService.getRequestsToPay();
  }

}
