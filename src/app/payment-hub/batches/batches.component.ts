import { Component, OnInit, ViewChild } from '@angular/core';
import { Dates } from 'app/core/utils/dates';
import { BatchesService } from './batches.service';
import { Batch, BatchData } from './model/batch.model';
import { UntypedFormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { SubBatchesService } from '../sub-batches/sub-batches.service';

@Component({
  selector: 'mifosx-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.scss']
})
export class BatchesComponent implements OnInit {

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

  /** Columns to be displayed in transactions table. */
  displayedColumns: string[] = ['batchReferenceNumber', 'startedAt', 'completedAt', 'sourceMinistry', 'amount', 'status'];
  /** Data source for transactions table. */
  dataSource = new MatTableDataSource();

  batchesData: Batch;
  totalRows = 0;
  currentPage = 0;

  pageSize = 50;
  isLoading = false;

  constructor(private dates: Dates,
    private route: ActivatedRoute,
    private router: Router,
    private batchesService: BatchesService) { }

  ngOnInit(): void {
    this.getBatches();
  }

  getBatches(): void {
    this.isLoading = true;
    this.batchesService.getBatches(this.currentPage, this.pageSize, 'requestFile', 'asc')
    .subscribe((batches: Batch) => {
      this.batchesData = batches;
      this.dataSource = new MatTableDataSource(this.batchesData.data);
      this.totalRows = batches.totalBatches;
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
    });
  }

  convertTimestampToUTCDate(timestamp: any) {
    if (!timestamp) {
      return undefined;
    }
    return this.dates.formatUTCDate(new Date(timestamp));
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getBatches();
  }

  status(item: BatchData): string {
    if (item.completed) {
      return 'green';
    }
    if (item.ongoing) {
      return 'yellow';
    }
    return 'red';
  }

  statusLabel(item: BatchData): string {
    if (item.completed) {
      return 'COMPLETED';
    }
    if (item.ongoing) {
      return 'ONGOING';
    }
    return 'FAILED';
  }

  gotoSubBatches(batchId: string): void {
    this.router.navigate(['..', 'sub-batches', batchId], { relativeTo: this.route });
  }

  searchBatches(): void { }

}
