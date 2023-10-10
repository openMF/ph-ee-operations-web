import { Component, OnInit } from '@angular/core';
import { Dates } from 'app/core/utils/dates';
import { TransactionsDataSource } from '../transactions/dataSource/transactions.datasource';
import { BatchesService } from './batches.service';
import { Batch } from './model/batch.model';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'mifosx-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.scss']
})
export class BatchesComponent implements OnInit {

  /** Minimum transaction date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum transaction date allowed. */
  maxDate = new Date();
  /** Transaction date from form control. */
  transactionDateFrom = new UntypedFormControl(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  /** Transaction date to form control. */
  transactionDateTo = new UntypedFormControl(new Date());
  /** Source Ministry form control. */
  sourceMinistry = new UntypedFormControl();
  /** Batch Reference Number form control. */
  batchReferenceNumber = new UntypedFormControl();
  /** Bulk Amount form control. */
  bulkAmount = new UntypedFormControl();

  /** Columns to be displayed in transactions table. */
  displayedColumns: string[] = ['batchReferenceNumber', 'startedAt', 'completedAt', 'sourceMinistry', 'amount', 'status'];
  /** Data source for transactions table. */
  dataSource: TransactionsDataSource;

  batchesData: Batch;

  page: number = 0;
  size: number = 100;

  constructor(private dates: Dates,
    private batchesService: BatchesService) { }

  ngOnInit(): void {
    this.getBatches();
  }

  getBatches(): void {
    this.batchesService.getBatches(this.page, this.size, 'requestFile', 'asc')
    .subscribe((batches: Batch) => {
      this.batchesData = batches;
    });
  }

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

  searchBatches(): void {
    
  }

}
