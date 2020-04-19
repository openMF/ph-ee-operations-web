/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { Transaction, Transactions } from '../model/transaction.model';
import { FilteredRecord } from '../model/filtered-record.model';


/**
 * Transaction data resolver.
 */
@Injectable()
export class TransactionsResolver implements Resolve<FilteredRecord<Transaction>> {

    /**
     * @param {Transaction[]} transactions Transactions.
     */
    constructor(private transactions: Transactions) { }

    /**
     * Returns the transaction data.
     * @returns {FilteredRecord<Transaction>}
     */
    resolve(): FilteredRecord<Transaction> {
        const filteredRecords = {} as FilteredRecord<Transaction>;
        filteredRecords.totalFilteredRecords = this.transactions.totalElements;
        filteredRecords.pageItems = this.transactions.content;

        return filteredRecords;
    }
}
