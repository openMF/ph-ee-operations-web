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
import { MatExpansionPanel } from '@angular/material/expansion';
import { BatchSummaryComponent } from './batch-summary/batch-summary.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

@Component({
  selector: 'mifosx-sub-batches',
  templateUrl: './sub-batches.component.html',
  styleUrls: ['./sub-batches.component.scss'],
})
export class SubBatchesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('panel') panel: MatExpansionPanel;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
    this.setSortingAccessor();
  }

  /** Minimum transaction date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum transaction date allowed. */
  maxDate = new Date();
  /** Transaction date from form control. */
  transactionDateFrom = new UntypedFormControl();
  /** Transaction date to form control. */
  transactionDateTo = new UntypedFormControl();
  /** Batch Reference Number form control. */
  batchReferenceNumber = new UntypedFormControl();
  /** Bulk Amount form control. */
  bulkAmount = new UntypedFormControl();
  /** Payer FSP form control. */
  payeeFsp = new UntypedFormControl();
  /** Sub Batch status form control. */
  subBatchStatus = new UntypedFormControl();
  /** Registering Institution Id form control. */
  registeringInstitutionId = new UntypedFormControl();
  /** Total Instruction Count form control*/
  totalInstructionCount = new UntypedFormControl();

  /** Sub Batches Status */
  subBatchStatuses = ['Completed', 'Rejected', 'Partially Authorized'];

  /** Columns to be displayed in Sub Batches table. */
  displayedColumns: string[] = ['batchReferenceNumber', 'startedAt', 'completedAt', 'payeeFsp', 'totalInstructionCount', 'amount', 'status'];
  /** Data source for Sub Batches table. */
  dataSource = new MatTableDataSource();

  /** Selected filters for current filter label */
  selectedFilters = {
    batchReferenceNumber: false,
    bulkAmount: false,
    subBatchStatus: false,
    transactionDateFrom: false,
    transactionDateTo: false,
    registeringInstitutionId: false,
    payeeFsp: false,
    totalInstructionCount: false,
  };

  subBatchesData: BatchDetail[] = [];
  batchData: BatchDetail | null = null;
  page = 0;
  size = 100;
  totalRows = 0;
  currentPage = 0;
  pageSize = 50;
  isLoading = false;
  batchId: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private dates: Dates, private subBatchesService: SubBatchesService, private dialog: MatDialog) {
    this.route.params.subscribe((params) => this.batchId = params['batchId']);
  }

  ngOnInit(): void {
    this.getSubBatchDetails();
  }

  /** Load batch details */
  getSubBatchDetails(): void {
    if (this.batchId) {
      this.isLoading = true;
      this.subBatchesService.getBatchDetail(this.batchId).subscribe(
        batchDetails => this.handleBatchDetailResponse(batchDetails),
        () => this.isLoading = false
      );
    }
  }

  /** Handle batch detail response */
  private handleBatchDetailResponse(batchDetails: BatchDetail): void {
    this.batchData = { ...batchDetails, subBatchSummaryList: null };
    this.subBatchesData = batchDetails.subBatchSummaryList || [];
    this.updateDataSource(this.subBatchesData);
    this.totalRows = this.subBatchesData.length;
    this.isLoading = false;
  }

  /** Set custom sorting accessor */
  private setSortingAccessor(): void {
    const propertyMap: { [key: string]: string } = {
      'batchReferenceNumber': 'subBatchId',
      'startedAt': 'startedAt',
      'completedAt': 'completedAt',
      'payeeFsp': 'payeeFsp',
      'amount': 'totalAmount',
      'status': 'status'
    };
    this.dataSource.sortingDataAccessor = (item: any, property: string) =>
      item[propertyMap[property]] || item.status;
  }

  /** Format timestamp to UTC date */
  convertTimestampToUTCDate(timestamp: any): string | undefined {
    return timestamp ? this.dates.formatUTCDate(new Date(timestamp)) : undefined;
  }

  /** Handle page change */
  pageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getSubBatchDetails();
  }

  /** Navigate to sub-batch details */
  gotoSubBatchesDetails(subBatchId: string): void {
    this.router.navigate([`dashboard/paymenthub/sub-batches/${this.batchId}/transfers/${subBatchId}`]);
  }

  /** Filter sub-batches */
  searchSubBatches(): void {
    const filteredData = this.filterSubBatchData();
    this.updateDataSource(filteredData);
    this.updateSelectedFilters();
    this.panel.close();
  }

  /** Filter sub-batch data based on form controls */
  private filterSubBatchData(): BatchDetail[] {
    const stripTime = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const fromDate = this.transactionDateFrom.value ? stripTime(new Date(this.transactionDateFrom.value)) : null;
    const toDate = this.transactionDateTo.value ? stripTime(new Date(this.transactionDateTo.value)) : null;

    return this.subBatchesData.filter((item: any) => {
      const dataStartedAtDate = stripTime(new Date(item.startedAt));
      const dataCompletedAtDate = stripTime(new Date(item.completedAt));
      const matchesDateRange = (!fromDate || dataStartedAtDate.getTime() === fromDate.getTime()) &&
        (!toDate || dataCompletedAtDate.getTime() === toDate.getTime());

      return matchesDateRange &&
        (!this.batchReferenceNumber.value || item.subBatchId.toLowerCase().includes(this.batchReferenceNumber.value.toLowerCase())) &&
        (!this.bulkAmount.value || item.totalAmount === this.bulkAmount.value) &&
        (!this.payeeFsp.value || item.payeeFsp.toLowerCase().includes(this.payeeFsp.value.toLowerCase())) &&
        (!this.subBatchStatus.value || item.status.toLowerCase().includes(this.subBatchStatus.value.toLowerCase())) &&
        (!this.totalInstructionCount.value || item.totalInstructionCount === this.totalInstructionCount.value);
    });
  }

  /** Update data source */
  private updateDataSource(data: BatchDetail[]): void {
    this.dataSource.data = data;
    this.dataSource.paginator = this.paginator;
  }

  /** Update selected filters state */
  private updateSelectedFilters(): void {
    this.selectedFilters.batchReferenceNumber = !!this.batchReferenceNumber.value;
    this.selectedFilters.bulkAmount = !!this.bulkAmount.value;
    this.selectedFilters.subBatchStatus = !!this.subBatchStatus.value;
    this.selectedFilters.transactionDateFrom = !!this.transactionDateFrom.value;
    this.selectedFilters.transactionDateTo = !!this.transactionDateTo.value;
    this.selectedFilters.payeeFsp = !!this.payeeFsp.value;
    this.selectedFilters.totalInstructionCount = !!this.totalInstructionCount.value;
  }

  /** Clear filter */
  removeFilter(filterType: string, event?: MouseEvent): void {
    event?.stopPropagation();
    (this as any)[filterType].reset();
    this.searchSubBatches();
  }

  /** Toggle the filter panel */
  togglePanel(event?: MouseEvent): void {
    event?.stopPropagation();
    this.panel.toggle();
  }

  /** View batch summary */
  viewSummary(): void {
    this.dialog.open(BatchSummaryComponent, { data: { batch: this.batchData } });
  }
}