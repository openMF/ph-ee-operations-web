/** Angular Imports */
import { Injectable } from '@angular/core';

/** Environment Imports */
import { environment } from '../../environments/environment';

/**
 * Settings Service
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  minAllowedDate = new Date(1950, 0, 1);
  maxAllowedDate = new Date(2100, 0, 1);

  constructor() { }

  /**
   * Sets date format setting throughout the app.
   * @param {string} dateFormat Date Format
   */
  setDateFormat(dateFormat: string) {
    localStorage.setItem('pheeDateFormat', JSON.stringify(dateFormat));
  }

  /**
   * Sets language setting throughout the app.
   * @param {any} language Language.
   */
  setLanguage(language: { name: string, code: string }) {
    localStorage.setItem('pheeLanguage', JSON.stringify(language));
  }

  /**
   * Sets decimals to Display throughout the app.
   * @param {string} decimals.
   */
  setDecimalToDisplay(decimals: string) {
    localStorage.setItem('pheeDecimalsToDisplay', decimals);
  }

  setDefaultLanguage() {
    const defaultLanguage = environment.defaultLanguage ? environment.defaultLanguage : 'en-US';
    this.setLanguage({
      name: defaultLanguage,
      code: defaultLanguage.substring(0, 2)
    });
  }

  /**
   * Sets server URL setting throughout the app.
   * @param {string} url URL
   */
  setServer(url: string) {
    localStorage.setItem('pheeServerURL', url);
  }

  /**
   * Sets server URL setting throughout the app.
   * @param {string[]} list List of default servers
   */
  setServers(list: string[]) {
    localStorage.setItem('pheeServers', JSON.stringify(list));
  }

  /**
   * Sets Tenant Identifiers list setting throughout the app.
   * @param {string[]} list List of default tenants
   */
  setTenantIdentifiers(list: string[]) {
    localStorage.setItem('pheeTenantIdentifiers', JSON.stringify(list));
  }

  /**
   * Sets Tenant Identifier setting throughout the app.
   * @param {string} Tenant Identifier
   */
  setTenantIdentifier(tenantIdentifier: string) {
    localStorage.setItem('pheeTenantIdentifier', tenantIdentifier);
  }

  /**
   * Returns date format setting.
   */
  get dateFormat() {
    return JSON.parse(localStorage.getItem('pheeDateFormat'));
  }

  /**
   * Returns language setting
   */
  get language() {
    if (!localStorage.getItem('pheeLanguage')) {
      this.setDefaultLanguage();
    }
    return JSON.parse(localStorage.getItem('pheeLanguage'));
  }

  /**
   * Returns Decimals to Display setting
   */
  get decimals() {
    if (!localStorage.getItem('pheeDecimalsToDisplay')) {
      return '2';
    }
    return localStorage.getItem('pheeDecimalsToDisplay');
  }

  /**
   * Returns list of default server
   */
  get servers() {
    return JSON.parse(localStorage.getItem('pheeServers'));
  }

  /**
   * Returns server setting
   */
  get server() {
    if (localStorage.getItem('pheeServerURL')) {
      return localStorage.getItem('pheeServerURL');
    }
    return environment.serverUrl;
  }

  /**
   * Returns server url with api path without version
   */
  get baseServerUrl() {
    return this.server + environment.apiPath;
  }

  /**
   * Returns server url with api path and version
   */
  get serverUrl() {
    return this.server + environment.apiPath + environment.apiVersion;
  }

  /**
   * Returns server url with api path and version
   */
  get serverHost() {
    return this.server;
  }

  /**
   * Returns min Past date
   */
  get minPastDate(): Date {
    return this.minAllowedDate;
  }

  /**
   * Returns max Future date
   */
  get maxFutureDate(): Date {
    return this.maxAllowedDate;
  }

  /**
   * Returns list of Tenant Identifiers
   */
  get tenantIdentifiers(): any {
    return JSON.parse(localStorage.getItem('pheeTenantIdentifiers'));
  }

  /**
   * Returns Tenant Identifier
   */
  get tenantIdentifier(): string {
    return localStorage.getItem('pheeTenantIdentifier');
  }

}
