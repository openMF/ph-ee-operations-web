/** Angular Imports */
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

/** rxjs Imports */
import { Observable, BehaviorSubject } from 'rxjs';

/** Custom Services */
import { Ig2FilesService } from '../service/ig2-files.service';
import { Ig2File, Ig2Files } from '../model/ig2-file.model';
import { FilteredIg2Files } from '../helper/filtered-ig2-files';
import { FilteredRecord } from '../model/filtered-record.model';
import { finalize } from 'rxjs/operators';

/**
 * Ig2 Files custom data source to implement server side filtering, pagination and sorting.
 */
export class Ig2FilesDataSource implements DataSource<Ig2File> {

    /** Ig2 files behavior subject to represent loaded ig2 files page. */
    private ig2FilesSubject = new BehaviorSubject<Ig2File[]>([]);
    /** Records subject to represent total number of filtered ig2 file records. */
    private recordsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    /** Records observable which can be subscribed to get the value of total number of filtered ig2 file records. */
    public records$ = this.recordsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();

    /**
     * @param {Ig2FilesService} ig2FilesService Ig2 Files Service
     */
    constructor(private ig2FilesService: Ig2FilesService) { }

    /**
     * Gets ig2 files on the basis of provided parameters and emits the value.
     * @param {any} filterBy Properties by which entries should be filtered.
     * @param {string} orderBy Property by which entries should be sorted.
     * @param {string} sortOrder Sort order: ascending or descending.
     * @param {number} pageIndex Page number.
     * @param {number} limit Number of entries within the page.
     */
    getIg2Files(filterBy: any, orderBy: string = '', sortOrder: string = '', pageIndex: number = 0, limit: number = 10) {
        this.loadingSubject.next(true);

        const page = pageIndex;
        const count = limit;

        this.ig2FilesService.getIg2Files(filterBy, page, count, orderBy, sortOrder)
            .pipe(finalize(() => this.loadingSubject.next(false)))
            .subscribe((ig2Files: Ig2Files) => {
                const filteredIg2Files: FilteredRecord<Ig2File> = new FilteredIg2Files(ig2Files);
                this.recordsSubject.next(filteredIg2Files.totalFilteredRecords);
                this.ig2FilesSubject.next(filteredIg2Files.pageItems);
            });
    }

    /**
     * @param {CollectionViewer} collectionViewer
     */
    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.ig2FilesSubject.asObservable();
    }

    /**
     * @param {CollectionViewer} collectionViewer
     */
    disconnect(collectionViewer: CollectionViewer): void {
        this.ig2FilesSubject.complete();
        this.recordsSubject.complete();
        this.loadingSubject.complete();
    }

}
