/** Angular Imports */
import { Injectable } from '@angular/core';


/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { TransactionsService } from '../service/transactions.service';
import { Currency } from '../model/currency.model';
import { DfspEntry } from '../model/dfsp.model';

/**
 * Currencies data resolver.
 */
@Injectable()
export class DfspResolver  {

    /**
     * @param {TransactionsService} transactionsService Transactions service.
     */
    constructor(private transactionsService: TransactionsService) { }

    /**
     * Returns the currencies data.
     * @returns {Observable<any>}
     */
    resolve(): Observable<any> {
        return this.transactionsService.getDfspEntries();
    }
}
