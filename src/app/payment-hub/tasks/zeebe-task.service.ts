/** Angular Routes */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

/** rxjs Imports */
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ZeebeTasks} from './zeebe-tasks.model';

/** Custom Models */

/**
 * Payment Hub - Transactions.
 *
 * TODO: Complete functionality once API is available.
 */
@Injectable({
    providedIn: 'root',
})
export class ZeebeTaskService {
    /**
     * @param {HttpClient} http Http Client to send requests.
     */
    constructor(private http: HttpClient) {
    }

    /**
     * Gets all the filtered transactions.
     *
     */
    getMyTasks(page: number, count: number, filters: any): Observable<ZeebeTasks> {
        let params = '';
        filters.forEach((field: any) => {
            if (field.value !== undefined && field.value !== null && field.value !== '') {
                params += field.type + '=' + field.value + '&';
            }
        });
        params += 'page=' + page + '&size=' + count;
        return this.http.get('/api/v1/tasks/me?' + params).pipe(map((transactions: any) => transactions as ZeebeTasks));
    }

    unclaim(keys: number[]): Observable<ZeebeTasks> {
        return this.http.post('/api/v1/tasks/unclaim', keys).pipe(map((transactions: any) => transactions as ZeebeTasks));
    }

    getTasks(page: number, count: number, filters: any): Observable<ZeebeTasks> {
        let params = '';
        filters.forEach((field: any) => {
            if (field.value !== undefined && field.value !== null && field.value !== '') {
                params += field.type + '=' + field.value + '&';
            }
        });
        params += 'page=' + page + '&size=' + count;
        return this.http.get('/api/v1/tasks/list?' + params).pipe(map((transactions: any) => transactions as ZeebeTasks));
    }

    claim(keys: number[]): Observable<ZeebeTasks> {
        return this.http.post('/api/v1/tasks/claim', keys).pipe(map((transactions: any) => transactions as ZeebeTasks));
    }

    getTask(id: number): Observable<ZeebeTasks> {
        return this.http.get('/api/v1/tasks/' + id).pipe(map((transactions: any) => transactions as ZeebeTasks));
    }

    submitTaskData(key: number, data: any): Observable<ZeebeTasks> {
        return this.http.post('/api/v1/tasks/' + key + '/submit', data).pipe(map((transactions: any) => transactions as ZeebeTasks));
    }

    /**
     * Get details of a Transaction.
     *
     */
    // getTransactionDetail(id: string): Observable<TransactionDetails> {
    //   return this.http.get('/api/v1/transfer/' + id).pipe(map((transaction: any) => transaction as TransactionDetails));
    // }
}
