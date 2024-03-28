/** Angular Routes */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }

  getBusinessProcessStatusData(direction: string, transferType: string): Observable<string[]> {
    const httpParams = new HttpParams()
      .set('direction', direction)
      .set('transferType', transferType);
    return this.http.get('/api/v1/businessProcessStatus', { params: httpParams }).pipe(map((transaction: any) => transaction as string[]));
  }
  
}
