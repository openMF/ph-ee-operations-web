/** Angular Imports */
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

/** rxjs Imports */
import { Observable, BehaviorSubject } from 'rxjs';

/** Custom Services */
import { Transaction, Transactions } from '../model/transaction.model';
import { FilteredTransactions } from '../helper/filtered-transactions';
import { FilteredRecord } from '../model/filtered-record.model';
import { BatchesService } from '../batches.service';
import { Batch } from '../model/batch.model';


export class BatchesDataSource implements DataSource<Batch> {

    private batchesSubject = new BehaviorSubject<Batch>();
    /** Records subject to represent total number of filtered journal entry records. */
    private recordsSubject = new BehaviorSubject<number>(0);
    /** Records observable which can be subscribed to get the value of total number of filtered journal entry records. */
    public records$ = this.recordsSubject.asObservable();

    /**
     * @param {BatchesService} batchesService Batches Service
     */
    constructor(private batchesService: BatchesService) { }

    /**
     * Gets batches on the basis of provided parameters and emits the value.
     * @param {any} filterBy Properties by which entries should be filtered.
     * @param {string} orderBy Property by which entries should be sorted.
     * @param {string} sortOrder Sort order: ascending or descending.
     * @param {number} pageIndex Page number.
     * @param {number} limit Number of entries within the page.
     */
    getBatches(filterBy: any, orderBy: string = '', sortOrder: string = '', pageIndex: number = 0, limit: number = 10) {
        this.batchesSubject.next([]);

        const page = pageIndex;
        const count = limit;

        this.batchesService.getBatches(page, count, filterBy, orderBy)
            .subscribe((batches: Batch) => {
                const filteredTransactions: FilteredRecord<Transaction> = new FilteredTransactions(transactions);
                this.recordsSubject.next(filteredTransactions.totalFilteredRecords);
                this.batchesSubject.next(batches.pageItems);
            });
    }

    /**
     * @param {CollectionViewer} collectionViewer
     */
    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.batchesSubject.asObservable();
    }

    /**
     * @param {CollectionViewer} collectionViewer
     */
    disconnect(collectionViewer: CollectionViewer): void {
        this.batchesSubject.complete();
        this.recordsSubject.complete();
    }

}
