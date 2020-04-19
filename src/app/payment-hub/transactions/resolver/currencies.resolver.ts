/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { TransactionsService } from '../service/transactions.service';
import { Currency } from '../model/currency.model';

/**
 * Currencies data resolver.
 */
@Injectable()
export class CurrenciesResolver implements Resolve<Currency[]> {

    /**
     * @param {TransactionsService} transactionsService Transactions service.
     */
    constructor(private transactionsService: TransactionsService) { }

    /**
     * Returns the currencies data.
     * @returns {Observable<any>}
     */
    resolve(): Observable<any> {
        return this.transactionsService.getCurrencies();
    }
}
