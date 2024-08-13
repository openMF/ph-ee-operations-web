/** Angular Routes */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Custom Models */
import { Ig2Files } from '../model/ig2-file.model';
import { Ig2FileDetails } from '../model/ig2-file-details.model';

/**
 * Payment Hub - Ig2 Files.
 *
 */
@Injectable({
  providedIn: 'root',
})
export class Ig2FilesService {
  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * Gets all the filtered ig2 files.
   *
   */
  getIg2Files(fields: any, page: number, count: number, orderBy: string, sortOrder: string): Observable<Ig2Files> {
    let params = '';
    fields.forEach((field: any) => {
      if (field.value !== undefined && field.value !== null && field.value !== '') {
        params += field.type + '=' + field.value + '&';
      }
    });
    params += 'page=' + page + '&size=' + count;
    if (orderBy) {
      params += '&sortedBy=' + orderBy;
    }
    if (sortOrder) {
      params += '&sortedOrder=' + sortOrder;
    }
    const recallsObservable = this.http.get('/api/v1/fileTransports?' + params).pipe(map((recalls: any) => recalls as Ig2Files));
    return recallsObservable;
  }

  /**
   * Get details of an ig2 file.
   *
   */
  getIg2FileDetail(id: string): Observable<Ig2FileDetails> {
    return this.http.get('/api/v1/fileTransport/' + id).pipe(map((recall: any) => recall as Ig2FileDetails));
  }
}
