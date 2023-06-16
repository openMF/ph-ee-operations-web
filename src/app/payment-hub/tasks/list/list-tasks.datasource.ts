/** Angular Imports */
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

/** rxjs Imports */
import { Observable, BehaviorSubject } from 'rxjs';
import {ZeebeTask, ZeebeTasks} from '../zeebe-tasks.model';
import {ZeebeTaskService} from '../zeebe-task.service';

/** Custom Services */

/**
 * Journal entries custom data source to implement server side filtering, pagination and sorting.
 */
export class ListTasksDatasource implements DataSource<ZeebeTask> {


    public transactionsSubject = new BehaviorSubject<ZeebeTask[]>([]);
    public recordsSubject = new BehaviorSubject<number>(0);
    public records$ = this.recordsSubject.asObservable();

    /**
     * @param {TransactionsService} tasksService Assignable Tasks Service
     */
    constructor(private tasksService: ZeebeTaskService) { }

    /**
     * Gets journal entries on the basis of provided parameters and emits the value.
     * @param {number} pageIndex Page number.
     * @param {number} limit Number of entries within the page.
     * @param filter
     */
    listTasks(pageIndex: number = 0, limit: number = 10, filter: any) {
        this.transactionsSubject.next([]);

        const page = pageIndex;
        const count = limit;

        this.tasksService.getTasks(page, count, filter)
            .subscribe((tasks: ZeebeTasks) => {
                this.recordsSubject.next(tasks.totalElements);
                this.transactionsSubject.next(tasks.content);
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
    }

}
