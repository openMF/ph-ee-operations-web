/** Angular Imports */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/** Environment Configuration */
import { environment } from 'environments/environment';

/** rxjs Imports */
import { forkJoin, Observable } from 'rxjs';

/**
 * G2P Payment Config Service.
 */
@Injectable({
  providedIn: 'root'
})
export class G2PPaymentConfigService {

  /** API URL Prefix */
  apiPrefix: string = environment.backend.g2pPaymentConfigApi;

  /**
   * @param {HttpClient} http HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * @returns {Observable<any>} Users data
   */
  getG2pPayments(): Observable<any> {
    return this.http.get(this.apiPrefix + '/g2pPaymentConfig');

    //mock data for g2p program config
    // return this.http.get('../../assets/mock/g2p-program-config.mock.json');
  }


  /** Create G2P Payment Config
   * @param {any} payload G2P Payment Config payload
   * @returns {Observable<any>} G2P Payment Config data
   */
  createG2pPayment( payload: any): Observable<any> {
    return this.http.post(this.apiPrefix + '/g2pPaymentConfig', payload);
  }


  /** Get G2P Payment Config by ID
   * @param {string} id G2P Payment Config ID
   * @returns {Observable<any>} G2P Payment Config data
   * */
  getG2pPaymentById(id: string): Observable<any> {
    return this.http.get(this.apiPrefix + '/g2pPaymentConfig/' + id);
  }

  /** Update G2P Payment Config
   * @param {string} id G2P Payment Config ID
   * @param {any} payload G2P Payment Config payload
   * @returns {Observable<any>} G2P Payment Config
   * */
  updateG2pPayment(id: string, payload: any): Observable<any> {
    return this.http.put(this.apiPrefix + '/g2pPaymentConfig/' + id, payload);
  }

  /** Delete G2P Payment Config
   * @param {string} id G2P Payment Config ID
   * @returns {Observable<any>} G2P Payment Config
   * */
  deleteG2pPayment(id: string): Observable<any> {
    return this.http.delete(this.apiPrefix + '/g2pPaymentConfig/' + id);
  }

  /** Get All Government Entities
   * @returns {Observable<any>} Government Entities data
   * */
  getGovtEntities(): Observable<any> {
    return this.http.get(this.apiPrefix + '/governmentEntity');
  }

  /** Get Government Entity by ID
   * @param {number} id Government Entity ID
   * @returns {Observable<any>} Government Entity data
   * */
  getGovtEntityById(id: number): Observable<any> {
    return this.http.get(this.apiPrefix + '/governmentEntity/' + id);
  }

  /** Get All Programs
   * @returns {Observable<any>} Programs data
   * */
  getPrograms(): Observable<any> {
    return this.http.get(this.apiPrefix + '/program');
  }


  /** Get All Payer DFSPs
   * @returns {Observable<any>} Payer DFSPs data
   * */
  getPayerDfsps(): Observable<any> {
    return this.http.get(this.apiPrefix + '/dfsp');
  }

  /** Get Payer DFSP by ID
   * @param {number} id Payer DFSP ID
   * @returns {Observable<any>} Payer DFSP data
   * */
  getPayerDfspsbyId(id: number): Observable<any> {
    return this.http.get(this.apiPrefix + '/dfsp/' + id);
  }

  /** Get Template Data
   * @returns {Observable<any>} Template data
   * */
  getTemplateData(): Observable<any> {

    return forkJoin({
      govtEntities: this.getGovtEntities(),
      programs: this.getPrograms(),
      payerDfsps: this.getPayerDfsps()
    });
  }

}
