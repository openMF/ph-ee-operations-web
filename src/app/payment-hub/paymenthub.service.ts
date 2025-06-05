import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dates } from 'app/core/utils/dates';

@Injectable({
  providedIn: 'root'
})
export class PaymenthubService {

  constructor(private http: HttpClient, private dateUtils: Dates) { }

  /**
   * Export a CSV file.
   * @param filterBy object containing the filters
   * @param url the API endpoint to call for the export
   * @param prefix the prefix to use for the file name
   * @param params optional parameters to pass to the API
   */
  exportCSV(filterBy: any, url: string, prefix: string, params: HttpParams = new HttpParams()) {
    let fileFilters = ''
    const startFrom = this.dateUtils.formatDate(filterBy.startdate, 'yyyy-MM-dd HH:mm:ss')
    const startTo = this.dateUtils.formatDate(filterBy.enddate, 'yyyy-MM-dd HH:mm:ss')
    const state = filterBy.status;
    if (startFrom) {
      params = params.set("startFrom", startFrom);
      fileFilters += `_FROM_${this.dateUtils.getDate(filterBy.startdate)}`
    }
    if (startTo) {
      params = params.set("startTo", startTo);
      fileFilters += `_TO_${this.dateUtils.getDate(filterBy.enddate)}`
    }
    if (state) {
      params = params.set("state", filterBy.status);
      fileFilters += `_FOR_STATUS_${filterBy.status}`
    }
    const exportURl = `${url}?${params}`;
    const postData = {
      transactionId: this.getValues(filterBy.transactionid),
      externalid: this.getValues(filterBy.externalid),
      workflowinstancekey: this.getValues(filterBy.workflowinstancekey),
      errorDescription: this.getValues(filterBy.errordescription),
      payeeId: this.getValues(filterBy.payeeid),
      payerId: this.getValues(filterBy.payerid),
      payerDfspId: this.getPayerDfspIdValues(filterBy.payerdfspid),
    };
    this.http
      .post(
        exportURl,
        JSON.stringify(postData),
        {
          responseType: "blob" as "json",
          headers: new HttpHeaders().append("Content-Type", "application/json"),
        }
      )
      .subscribe((val: Blob) => {
        this.downloadFile(val, `${prefix}${fileFilters}_AS_AT_${this.dateUtils.formatDate(new Date(), 'yyyy-MM-dd_HH:mm:ss')}.csv`);
      });
  }

  /**
   * Download a file.
   * @param data the file to download
   * @param fileTitle the name of the file to be downloaded
   */
  private downloadFile(data: Blob, fileTitle: string) {
    let url = window.URL.createObjectURL(data);
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = fileTitle;
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Get values from a comma separated string.
   * @param value comma separated string
   * @returns an array of values
   */
  private getValues(value: string): string[] {
    return value ? value.split(",") : [];
  }

  private getPayerDfspIdValues(value: any): string[] {
    return value == "" ? [] : value;
  }
}
