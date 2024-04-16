/** Angular Imports */
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

/** rxjs Imports */
import { Observable, BehaviorSubject } from 'rxjs';

/** Custom Services */
import { TransactionsService } from '../service/transactions.service';
import { Transaction, Transactions } from '../model/transaction.model';
import { FilteredTransactions } from '../helper/filtered-transactions';
import { FilteredRecord } from '../model/filtered-record.model';
import { finalize } from 'rxjs/operators';

/**
 * Journal entries custom data source to implement server side filtering, pagination and sorting.
 */
export class TransactionsDataSource implements DataSource<Transaction> {

    /** Journal entries behavior subject to represent loaded journal entries page. */
    private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
    /** Records subject to represent total number of filtered journal entry records. */
    private recordsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    /** Records observable which can be subscribed to get the value of total number of filtered journal entry records. */
    public records$ = this.recordsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();

    /**
     * @param {TransactionsService} transactionsService Transactions Service
     */
    constructor(private transactionsService: TransactionsService) { }

    /**
     * Gets journal entries on the basis of provided parameters and emits the value.
     * @param {any} filterBy Properties by which entries should be filtered.
     * @param {string} orderBy Property by which entries should be sorted.
     * @param {string} sortOrder Sort order: ascending or descending.
     * @param {number} pageIndex Page number.
     * @param {number} limit Number of entries within the page.
     */
    getTransactions(filterBy: any, orderBy: string = '', sortOrder: string = '', pageIndex: number = 0, limit: number = 10) {
        this.loadingSubject.next(true);
        //this.transactionsSubject.next([]);

        const page = pageIndex;
        const count = limit;

        this.transactionsService.getTransactions(filterBy, page, count, orderBy, sortOrder)
            .pipe(finalize(() => this.loadingSubject.next(false)))
            .subscribe((transactions: Transactions) => {
                const filteredTransactions: FilteredRecord<Transaction> = new FilteredTransactions(transactions);
                this.recordsSubject.next(filteredTransactions.totalFilteredRecords);
                this.transactionsSubject.next(filteredTransactions.pageItems);
            });
    }

    /**
     * @param {CollectionViewer} collectionViewer
     */
    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.transactionsSubject.asObservable();
    }

    /**
     * @param {CollectionViewer} collectionViewer
     */
    disconnect(collectionViewer: CollectionViewer): void {
        this.transactionsSubject.complete();
        this.recordsSubject.complete();
        this.loadingSubject.complete();
    }

}
