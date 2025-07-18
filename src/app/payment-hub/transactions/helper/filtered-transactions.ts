/** Angular Imports */
import { Injectable } from '@angular/core';


/** Custom Services */
import { Transaction, Transactions } from '../model/transaction.model';
import { FilteredRecord } from '../model/filtered-record.model';


/**
 * Filtered Transaction data.
 */
export class FilteredTransactions implements FilteredRecord<Transaction> {

    totalFilteredRecords: number;
    pageItems: Transaction[];
    /**
     * @param {Transaction[]} transactions Transactions.
     */
    constructor(private transactions: Transactions) {
        this.totalFilteredRecords = this.transactions.totalElements;
        this.pageItems = this.transactions.content;
    }
}
