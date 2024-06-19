import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionsDataSource } from '../transactions/dataSource/transactions.datasource';
import { Dates } from 'app/core/utils/dates';
import { Batch } from '../batches/model/batch.model';
import { SubBatchesService } from './sub-batches.service';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchDetail, SubBatchList } from '../batches/model/batch-detail.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'mifosx-sub-batches',
  templateUrl: './sub-batches.component.html',
  styleUrls: ['./sub-batches.component.scss']
})
export class SubBatchesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
  dataSource = new MatTableDataSource();

  subBatchesData: BatchDetail[] = [];

  page = 0;
  size = 100;
  totalRows = 0;
  currentPage = 0;

  pageSize = 50;
  isLoading = false;

  batchId: string | null = null;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private dates: Dates,
    private subBatchesService: SubBatchesService) {
    this.route.params.subscribe(params => {
      this.batchId = params['batchId'];
      console.log(this.batchId);
    });
  }

  ngOnInit(): void {
    this.getBatchDetail(this.batchId);
  }

  getBatchDetail(batchId: string): void {
    this.isLoading = true;
    if (batchId != null) {
      this.subBatchesService.getBatchDetail(batchId)
      .subscribe((batchDetails: BatchDetail) => {
        this.subBatchesData = batchDetails.subBatchSummaryList;
        this.dataSource = new MatTableDataSource(this.subBatchesData);
        this.totalRows = this.subBatchesData ? this.subBatchesData.length : 0;
        this.isLoading = false;
      });
    }
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

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getBatchDetail(this.batchId);
  }

  gotoSubBatchesDetails(subBatchId: string): void {
    this.router.navigate(['/paymenthub/transfers'], { queryParams: {
      b: this.batchId,
      s: subBatchId
    } });
  }
}
