/** Angular Imports */
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

/** rxjs Imports */
import { Observable, BehaviorSubject } from 'rxjs';

/** Custom Services */
import { RequestToPayService } from '../service/request-to-pay.service';
import { RequestPay, RequestPays } from '../model/requestPay.model';
import { FilteredRequests } from '../helper/filtered-requests';
import { FilteredRecord } from '../model/filtered-record.model';

/**
 * Journal entries custom data source to implement server side filtering, pagination and sorting.
 */
export class RequestToPayDataSource implements DataSource<RequestPay> {

    /** Journal entries behavior subject to represent loaded journal entries page. */
    private requestsSubject = new BehaviorSubject<RequestPay[]>([]);
    /** Records subject to represent total number of filtered journal entry records. */
    private recordsSubject = new BehaviorSubject<number>(0);
    /** Records observable which can be subscribed to get the value of total number of filtered journal entry records. */
    public records$ = this.recordsSubject.asObservable();

    /**
     * @param {RequestToPayService} requestToService Transactions Service
     */
    constructor(private requestToService: RequestToPayService) { }

    /**
     * Gets journal entries on the basis of provided parameters and emits the value.
     * @param {any} filterBy Properties by which entries should be filtered.
     * @param {string} orderBy Property by which entries should be sorted.
     * @param {string} sortOrder Sort order: ascending or descending.
     * @param {number} pageIndex Page number.
     * @param {number} limit Number of entries within the page.
     */
     getRequestsPay(filterBy: any, orderBy: string = '', sortOrder: string = '', pageIndex: number = 0, limit: number = 10) {
        this.requestsSubject.next([]);

        const page = pageIndex;
        const count = limit;

        this.requestToService.getRequests(filterBy, page, count)
            .subscribe((requestPays: RequestPays) => {
                const filteredRequests: FilteredRecord<RequestPay> = new FilteredRequests(requestPays);
                this.recordsSubject.next(filteredRequests.totalFilteredRecords);
                this.requestsSubject.next(filteredRequests.pageItems);
            });
    }

    /**
     * @param {CollectionViewer} collectionViewer
     */
    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.requestsSubject.asObservable();
    }

    /**
     * @param {CollectionViewer} collectionViewer
     */
    disconnect(collectionViewer: CollectionViewer): void {
        this.requestsSubject.complete();
        this.recordsSubject.complete();
    }

}
