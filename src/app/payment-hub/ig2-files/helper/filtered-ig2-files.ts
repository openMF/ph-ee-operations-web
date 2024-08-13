/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

/** Custom Services */
import { Ig2File, Ig2Files } from '../model/ig2-file.model';
import { FilteredRecord } from '../model/filtered-record.model';


/**
 * Filtered Ig2 File data.
 */
export class FilteredIg2Files implements FilteredRecord<Ig2File> {

    totalFilteredRecords: number;
    pageItems: Ig2File[];
    /**
     * @param {Ig2File[]} ig2Files Ig2 Files.
     */
    constructor(private ig2Files: Ig2Files) {
        this.totalFilteredRecords = this.ig2Files.totalElements;
        this.pageItems = this.ig2Files.content;
    }
}
