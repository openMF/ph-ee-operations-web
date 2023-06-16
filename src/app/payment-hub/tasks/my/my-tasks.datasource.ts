import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {ZeebeTask, ZeebeTasks} from '../zeebe-tasks.model';
import {ZeebeTaskService} from '../zeebe-task.service';

export class MyTasksDatasource implements DataSource<ZeebeTasks> {

    public transactionsSubject = new BehaviorSubject<ZeebeTask[]>([]);
    public recordsSubject = new BehaviorSubject<number>(0);
    public records$ = this.recordsSubject.asObservable();

    /**
     * @param {TransactionsService} tasksService My Tasks Service
     */
    constructor(private tasksService: ZeebeTaskService) {
    }

    /**
     * Gets journal entries on the basis of provided parameters and emits the value.
     * @param {number} pageIndex Page number.
     * @param {number} limit Number of entries within the page.
     */
    getMyTasks(pageIndex: number = 0, limit: number = 10, filter: any) {
        this.transactionsSubject.next([]);

        const page = pageIndex;
        const count = limit;

        this.tasksService.getMyTasks(page, count, filter)
            .subscribe((myTasks: ZeebeTasks) => {
                this.recordsSubject.next(myTasks.totalElements);
                this.transactionsSubject.next(myTasks.content);
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
