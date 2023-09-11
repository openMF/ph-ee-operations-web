/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

/** Custom Services */
import { Recall, Recalls } from '../model/recall.model';
import { FilteredRecord } from '../model/filtered-record.model';


/**
 * Filtered Recall data.
 */
export class FilteredRecalls implements FilteredRecord<Recall> {

    totalFilteredRecords: number;
    pageItems: Recall[];
    /**
     * @param {Recall[]} recalls Recalls.
     */
    constructor(private recalls: Recalls) {
        this.totalFilteredRecords = this.recalls.totalElements;
        this.pageItems = this.recalls.content;
    }
}
