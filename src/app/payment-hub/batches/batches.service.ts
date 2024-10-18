import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'app/settings/settings.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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
    //.set('type', 'json');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',   // Specify JSON content type
      'Purpose': purpose,
      'type': 'raw',
      'X-CorrelationID': correlationID,
      'Platform-TenantId': this.settingsService.tenantIdentifier,
      'X-Registering-Institution-Id': institutionId,
      'X-Signature': signature, 
      'X-Callback-URL': environment.backend.voucherCallbackUrl,
      'X-Program-Id': programId
      //'FILE_NAME': "fred.cvs" 
    });

    console.info('TD Request URL:', this.bulkConnectorOps + '/batchtransactions');
    console.log('TD sig to send : ', signature )
    console.log('TD Request Headers:', headers);

    const options = {
      headers: headers,
      observe: 'response' as 'body'
    };

    return this.http.post(this.bulkConnectorOps + '/batchtransactions', payload  , options )
      .pipe(
        tap(response => console.log('Response:', response)),
        catchError(error => {
          console.error('TD Error in createBatch:', error);
          console.error('TD Error details:', error.error);
          console.error('TD Status:', error.status);
          console.error('TD StatusText:', error.statusText);
          throw error;
        })
      );
  }

}


