/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { RecallsService } from '../service/recalls.service';
import { Currency } from '../model/currency.model';
import { DfspEntry } from '../model/dfsp.model';

/**
 * Currencies data resolver.
 */
@Injectable()
export class DfspResolver implements Resolve<DfspEntry[]> {

    /**
     * @param {RecallsService} recallsService Recalls service.
     */
    constructor(private recallsService: RecallsService) { }

    /**
     * Returns the currencies data.
     * @returns {Observable<any>}
     */
    resolve(): Observable<any> {
        return this.recallsService.getDfspEntries();
    }
}
