/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { RecallsService } from '../service/recalls.service';

/**
 * Recall data resolver.
 */
@Injectable()
export class RecallResolver implements Resolve<Object> {

  /**
   * @param {RecallsService} recallsService Recalls service.
   */
  constructor(private recallsService: RecallsService) { }

  /**
   * Returns the recall data.
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const transactionId = route.paramMap.get('id');
    return this.recallsService.getRecallDetail(transactionId);
  }

}
