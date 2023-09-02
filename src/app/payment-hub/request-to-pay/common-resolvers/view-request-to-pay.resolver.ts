/** Angular Imports */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { RequestToPayService } from '../service/request-to-pay.service';

/**
 * Request to pay data resolver.
 */
@Injectable()
export class ViewRequestToPayResolver  {

  /**
   * @param {RequestToPayService} requestToPayService RequestToPay Service.
   */
  constructor(private requestToPayService: RequestToPayService) { }

  /**
   * Returns the transaction data.
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const requestId = route.paramMap.get('id');
    return this.requestToPayService.getRequestToPay(requestId);
  }

}
