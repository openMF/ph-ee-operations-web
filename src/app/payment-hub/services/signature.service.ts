import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  constructor(private http: HttpClient) { }

  createSignature(payload: any): Observable<any> {
    return this.http.post(environment.backend.signatureApiUrl + '/api/sign', payload);
  }

}
