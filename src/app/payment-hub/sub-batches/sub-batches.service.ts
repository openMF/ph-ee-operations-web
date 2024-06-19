import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubBatchesService {

  apiPrefix: string = environment.backend.operations;

  constructor(private http: HttpClient) { }

  /**
   * @returns {Observable<any>} Users data
   */
  getSubBatches(batchId: string, page: number, size: number): Observable<any> {
    const httpParams = new HttpParams()
    .set('page', page)
    .set('size', size);

    return this.http.get(this.apiPrefix + '/batch/detail?batchId=' + batchId);
  }

  getBatchDetail(batchId: string): Observable<any> {
    return this.http.get(this.apiPrefix + '/batches/' + batchId);
  }
}
