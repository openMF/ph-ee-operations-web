/** Angular Imports */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { G2PPaymentConfigService } from '../services/g2p-payment-config.service';

/**
 * View  resolver.
 */
@Injectable()
export class ViewPaymentConfigResolver  {

  /**
   * @param {G2PPaymentConfigService} g2pPaymentConfigService Users service.
   */
  constructor(private g2pPaymentConfigService: G2PPaymentConfigService) {}

  /**
   * Returns the G2p Payment Config data by ID.
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const config_id = route.paramMap.get('id');
    return this.g2pPaymentConfigService.getG2pPaymentById(config_id);
  }
}
