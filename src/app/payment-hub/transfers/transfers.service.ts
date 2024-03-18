import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransfersService {

  apiPrefix: string = environment.backend.operations;

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }

  getTransfers(page: number, size: number): Observable<any> {
    const httpParams = new HttpParams()
    .set('page', page)
    .set('size', size);
    const headers = new HttpHeaders()
    .set('Platform-TenantId', environment.tenant);

    return this.http.get(this.apiPrefix + '/transfers', { params: httpParams, headers: headers });
  }

  getSubBatchSumaryDetail(batchId: string, subBatchId: string): Observable<any> {
    return this.http.get(this.apiPrefix + '/batches/' + batchId + '/subBatches/' + subBatchId);
  }

}
