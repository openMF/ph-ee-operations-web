import { Component, OnInit } from '@angular/core';
import { TransactionsDataSource } from '../transactions/dataSource/transactions.datasource';
import { Dates } from 'app/core/utils/dates';
import { Batch } from '../batches/model/batch.model';
import { SubBatchesService } from './sub-batches.service';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'mifosx-sub-batches',
  templateUrl: './sub-batches.component.html',
  styleUrls: ['./sub-batches.component.scss']
})
export class SubBatchesComponent implements OnInit {
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
  /** Bulk Amount form control. */
  payerFSP = new UntypedFormControl();

  /** Columns to be displayed in transactions table. */
  displayedColumns: string[] = ['batchReferenceNumber', 'startedAt', 'completedAt', 'sourceMinistry', 'amount', 'payerFSP', 'status'];
  /** Data source for transactions table. */
  dataSource: TransactionsDataSource;

  batchesData: Batch;

  page: number = 0;
  size: number = 100;

  constructor(private dates: Dates,
    private subBatchesService: SubBatchesService) { }

  ngOnInit(): void {
    this.getBatches();
  }

  getBatches(): void {
    this.subBatchesService.getSubBatches(this.page, this.size, 'requestFile', 'asc')
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

  searchSubBatches(): void {

  }

}
