import { Component } from '@angular/core';
import { Dates } from 'app/core/utils/dates';
import { TransactionsDataSource } from '../transactions/dataSource/transactions.datasource';

@Component({
  selector: 'mifosx-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.scss']
})
export class BatchesComponent {
  /** Columns to be displayed in transactions table. */
  displayedColumns: string[] = ['batchReferenceNumber', 'startedAt', 'completedAt', 'sourceMinistry', 'amount', 'status'];
  /** Data source for transactions table. */
  dataSource: TransactionsDataSource;

  constructor(private dates: Dates) { }


  convertTimestampToUTCDate(timestamp: any) {
    if (!timestamp) {
      return undefined;
    }
    return this.dates.formatUTCDate(new Date(timestamp));
  }

  convertTimestampToDate(timestamp: any) {
    if (!timestamp) {
      return undefined;
    }
    return this.dates.formatDate(new Date(timestamp), Dates.DEFAULT_DATEFORMAT);
  }

}
