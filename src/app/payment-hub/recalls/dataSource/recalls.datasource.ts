/** Angular Imports */
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

/** rxjs Imports */
import { Observable, BehaviorSubject } from 'rxjs';

/** Custom Services */
import { RecallsService } from '../service/recalls.service';
import { Recall, Recalls } from '../model/recall.model';
import { FilteredRecalls } from '../helper/filtered-recalls';
import { FilteredRecord } from '../model/filtered-record.model';

/**
 * Journal entries custom data source to implement server side filtering, pagination and sorting.
 */
export class RecallsDataSource implements DataSource<Recall> {

    /** Journal entries behavior subject to represent loaded journal entries page. */
    private recallsSubject = new BehaviorSubject<Recall[]>([]);
    /** Records subject to represent total number of filtered journal entry records. */
    private recordsSubject = new BehaviorSubject<number>(0);
    /** Records observable which can be subscribed to get the value of total number of filtered journal entry records. */
    public records$ = this.recordsSubject.asObservable();

    /**
     * @param {RecallsService} recallsService Recalls Service
     */
    constructor(private recallsService: RecallsService) { }

    /**
     * Gets journal entries on the basis of provided parameters and emits the value.
     * @param {any} filterBy Properties by which entries should be filtered.
     * @param {string} orderBy Property by which entries should be sorted.
     * @param {string} sortOrder Sort order: ascending or descending.
     * @param {number} pageIndex Page number.
     * @param {number} limit Number of entries within the page.
     */
    getRecalls(filterBy: any, orderBy: string = '', sortOrder: string = '', pageIndex: number = 0, limit: number = 10) {
        this.recallsSubject.next([]);

        const page = pageIndex;
        const count = limit;

        this.recallsService.getRecalls(filterBy, page, count, orderBy, sortOrder)
            .subscribe((recalls: Recalls) => {
                const filteredRecalls: FilteredRecord<Recall> = new FilteredRecalls(recalls);
                this.recordsSubject.next(filteredRecalls.totalFilteredRecords);
                this.recallsSubject.next(filteredRecalls.pageItems);
            });
    }

    /**
     * @param {CollectionViewer} collectionViewer
     */
    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.recallsSubject.asObservable();
    }

    /**
     * @param {CollectionViewer} collectionViewer
     */
    disconnect(collectionViewer: CollectionViewer): void {
        this.recallsSubject.complete();
        this.recordsSubject.complete();
    }

}
