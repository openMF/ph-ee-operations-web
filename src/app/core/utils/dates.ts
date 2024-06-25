import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Dates {

  public static DEFAULT_DATEFORMAT = 'yyyy-MM-dd';
  public static DEFAULT_DATETIMEFORMAT = 'yyyy-MM-dd HH:mm:ss';

  constructor(private datePipe: DatePipe) {}

  public getDate(timestamp: any): string {
    return this.datePipe.transform(timestamp, 'YYYY-MM-dd');
  }

  public formatDate(timestamp: any, dateFormat: string): string {
    return this.datePipe.transform(timestamp, dateFormat);
  }
}
