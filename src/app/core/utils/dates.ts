import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class Dates {

  public static DEFAULT_DATEFORMAT = 'yyyy-MM-dd';
  public static DEFAULT_DATETIMEFORMAT = 'yyyy-MM-dd HH:mm';

  constructor(private datePipe: DatePipe) {}

  public getDate(timestamp: any): string {
    return this.datePipe.transform(timestamp, 'YYYY-MM-DD');
  }

  public formatDate(timestamp: any, dateFormat: string): string {
    return this.datePipe.transform(timestamp, dateFormat);
  }

  public parseDate(value: any): Date {
    if (value instanceof Array) {
      return moment.default(value.join('-'), 'YYYY-MM-DD').toDate();
    } else {
      return moment.default(value).toDate();
    }
  }

  public parseDatetime(value: any): Date {
    return moment.default(value).toDate();
  }

  public convertToDate(value: any, format: string): Date {
    return moment.default(value).toDate();
  }

  public formatUTCDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = '0' + (date.getUTCMonth() + 1);
    const day = '0' + date.getUTCDate();
    // Hours part from the timestamp
    const hours = '0' + date.getUTCHours();
    // Minutes part from the timestamp
    const minutes = '0' + date.getUTCMinutes();
    // Seconds part from the timestamp
    const seconds = '0' + date.getUTCSeconds();

    // Will display time in 2020-04-10 18:04:36Z format
    return year + '-' + month.substr(-2) + '-' + day.substr(-2) + 'T' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }
}
