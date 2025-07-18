/** Angular Imports */
import { Injectable } from '@angular/core';


/** Custom Services */
import { RequestPay, RequestPays } from '../model/requestPay.model';
import { FilteredRecord } from '../model/filtered-record.model';


/**
 * Filtered Transaction data.
 */
export class FilteredRequests implements FilteredRecord<RequestPay> {

    totalFilteredRecords: number;
    pageItems: RequestPay[];
    /**
     * @param {RequestPay[]} transactions Transactions.
     */
    constructor(private requestPays: RequestPays) {
        this.totalFilteredRecords = this.requestPays.totalElements;
        this.pageItems = this.requestPays.content;
    }
}
