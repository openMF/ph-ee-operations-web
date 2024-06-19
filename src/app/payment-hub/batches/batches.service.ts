import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'app/settings/settings.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BatchesService {

  apiPrefix: string = environment.backend.operations;
  bulkConnectorOps: string = environment.backend.bulkConnectorOps;

  constructor(private http: HttpClient,
    private settingsService: SettingsService) { }

  /**
   * @returns {Observable<any>} Users data
   */
  getBatches(page: number, size: number, orderBy: string, sortOrder: string): Observable<any> {
    const httpParams = new HttpParams()
    .set('page', page)
    .set('size', size)
    .set('sortOrder', sortOrder)
    .set('orderBy', orderBy);

    return this.http.get(this.apiPrefix + '/batches', { params: httpParams });
  }

  createBatch(correlationID: string, institutionId: string, purpose: string, programId: string, signature: string, payload: any): Observable<any> {
    const httpParams = new HttpParams()
    .set('type', 'raw');
    const headers = new HttpHeaders()
    .append('Purpose', purpose)
    .append('type', 'raw')
    .append('X-CorrelationID', correlationID)
    .append('Platform-TenantId', this.settingsService.tenantIdentifier)
    .append('X-Signature', signature)
    .append('X-Callback-URL', environment.backend.voucherCallbackUrl)
    .append('X-Registering-Institution-Id', institutionId)
    .append('X-Program-Id', programId);
    return this.http.post(this.bulkConnectorOps + '/batchtransactions', payload, { params: httpParams, headers: headers });
  }

}
