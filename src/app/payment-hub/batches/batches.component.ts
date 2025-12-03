/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatExpansionPanel } from '@angular/material/expansion';

/** Custom Models */
import { Dates } from 'app/core/utils/dates';
import { Batch, BatchData } from './model/batch.model';

/** Custom Services */
import { BatchesService } from './batches.service';

@Component({
  selector: 'mifosx-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.scss'],
})
export class BatchesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('panel') panel: MatExpansionPanel;

  /** Minimum transaction date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum transaction date allowed. */
  maxDate = new Date();
  /** Transaction date from form control. */
  transactionDateFrom = new UntypedFormControl();
  /** Transaction date to form control. */
  transactionDateTo = new UntypedFormControl();
  /** Source Ministry form control. */
  sourceMinistry = new UntypedFormControl();
  /** Batch Reference Number form control. */
  batchReferenceNumber = new UntypedFormControl();
  /** Bulk Amount form control. */
  bulkAmount = new UntypedFormControl();
  /** Batch status form control. */
  batchStatus = new UntypedFormControl();
  /** Registering Institution Id form control. */
  registeringInstitutionId = new UntypedFormControl();
  /** Total transaction count form control. */
  totalInstructionCount = new UntypedFormControl();
  /** Payer FSP form control. */
  payerFsp = new UntypedFormControl();

  /** Columns to be displayed in Batches table. */
  displayedColumns: string[] = ['batchReferenceNumber', 'startedAt', 'completedAt', 'registeringInstitutionId', 'sourceMinistry', 'totalInstructionCount', 'amount', 'payerFsp', 'status'];
  /** Data source for Batches table. */
  dataSource = new MatTableDataSource();

  /** Batches Status */
  batchStatuses = ['Completed', 'Rejected', 'Partially Authorized'];

  /** Selected filters for current filter label */
  selectedFilters = {
    sourceMinistry: false,
    batchReferenceNumber: false,
    bulkAmount: false,
    batchStatus: false,
    transactionDateFrom: false,
    transactionDateTo: false,
    registeringInstitutionId: false,
    totalInstructionCount: false,
    payerFsp: false,
  };

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

  /** Fetches batch data */
  getBatches(): void {
    this.isLoading = true;
    this.batchesService.getBatches(this.currentPage, this.pageSize, 'requestFile', 'asc').subscribe(
      (batches: Batch) => {
        this.batchesData = batches;
        this.dataSource = new MatTableDataSource(this.batchesData.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = this.getSortingAccessor();
        this.totalRows = batches.totalBatches;
        this.isLoading = false;
      },
      () => (this.isLoading = false)
    );
  }

  /** Sorting logic for table */
  getSortingAccessor(): (item: any, property: string) => any {
    return (item: any, property: string) => {
      switch (property) {
        case 'batchReferenceNumber':
          return item.batchId;
        case 'registeringInstitutionId':
          return item.registeringInstitutionId;
        case 'startedAt':
          return item.startedAt;
        case 'completedAt':
          return item.completedAt;
        case 'sourceMinistry':
          return item.sourceMinistry;
        case 'amount':
          return item.totalAmount;
        case 'totalInstructionCount':
          return item.totalInstructionCount;
        case 'payerFsp':
          return item.payerFsp;
        default:
          return this.statusLabel(item);
      }
    };
  }

  /** Pagination change handler */
  pageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getBatches();
  }

  /** Status label and color based on batch data */
  statusLabel(item: BatchData): string {
    if (item.completed) return 'Completed';
    if (item.ongoing) return 'Partially Authorized';
    return 'Rejected';
  }

  status(item: BatchData): string {
    if (item.completed) return 'green';
    if (item.ongoing) return 'orange';
    return 'red';
  }

  /** Filter batches based on search criteria */
  searchBatches(): void {
    const filterValues = this.getFilterValues();
    this.dataSource.filterPredicate = this.createFilterPredicate();
    this.dataSource.filter = JSON.stringify(filterValues);

    this.updateSelectedFilters();
    this.panel.close();
  }

  /** Create filter values based on form controls */
  getFilterValues() {
    return {
      transactionDateFrom: this.transactionDateFrom.value,
      transactionDateTo: this.transactionDateTo.value,
      sourceMinistry: this.sourceMinistry.value?.trim().toLowerCase() || '',
      batchReferenceNumber: this.batchReferenceNumber.value?.trim().toLowerCase() || '',
      bulkAmount: this.bulkAmount.value || null,
      batchStatus: this.batchStatus.value?.trim().toLowerCase() || '',
      registeringInstitutionId: this.registeringInstitutionId.value?.trim().toLowerCase() || '',
      totalInstructionCount: this.totalInstructionCount.value || null,
      payerFsp: this.payerFsp.value?.trim().toLowerCase() || ''
    };
  }

  /** Create filter predicate for filtering data */
  createFilterPredicate() {
    const stripTime = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return (data: any, filter: string) => {
      const searchTerms = JSON.parse(filter);

      const matchesTransactionDateFrom = !searchTerms.transactionDateFrom || stripTime(new Date(data.startedAt)).getTime() === stripTime(new Date(searchTerms.transactionDateFrom)).getTime();
      const matchesTransactionDateTo = !searchTerms.transactionDateTo || stripTime(new Date(data.completedAt)).getTime() === stripTime(new Date(searchTerms.transactionDateTo)).getTime();
      const matchesSourceMinistry = !searchTerms.sourceMinistry || data.sourceMinistry.toLowerCase().includes(searchTerms.sourceMinistry);
      const matchesBatchReferenceNumber = !searchTerms.batchReferenceNumber || data.batchId.toLowerCase().includes(searchTerms.batchReferenceNumber);
      const matchesBulkAmount = searchTerms.bulkAmount === null || data.totalAmount === searchTerms.bulkAmount;
      const matchesTotalInstructionCount = searchTerms.totalInstructionCount === null || data.totalInstructionCount === searchTerms.totalInstructionCount;
      const matchesPayerFsp = !searchTerms.payerFsp || data.payerFsp.toLowerCase().includes(searchTerms.payerFsp);
      const matchesBatchStatus = !searchTerms.batchStatus || this.statusLabel(data).toLowerCase().includes(searchTerms.batchStatus);
      const matchesRegisteringInstitutionId = !searchTerms.registeringInstitutionId || data.registeringInstitutionId.toLowerCase().includes(searchTerms.registeringInstitutionId);

      return matchesTransactionDateFrom &&
        matchesTransactionDateTo &&
        matchesSourceMinistry &&
        matchesBatchReferenceNumber &&
        matchesBulkAmount &&
        matchesTotalInstructionCount &&
        matchesPayerFsp &&
        matchesBatchStatus &&
        matchesRegisteringInstitutionId;
    };
  }

  /** Update selected filters for UI labels */
  updateSelectedFilters(): void {
    this.selectedFilters.transactionDateFrom = !!this.transactionDateFrom.value;
    this.selectedFilters.transactionDateTo = !!this.transactionDateTo.value;
    this.selectedFilters.sourceMinistry = !!this.sourceMinistry.value;
    this.selectedFilters.batchReferenceNumber = !!this.batchReferenceNumber.value;
    this.selectedFilters.bulkAmount = !!this.bulkAmount.value;
    this.selectedFilters.batchStatus = !!this.batchStatus.value;
    this.selectedFilters.registeringInstitutionId = !!this.registeringInstitutionId.value;
    this.selectedFilters.totalInstructionCount = !!this.totalInstructionCount.value;
    this.selectedFilters.payerFsp = !!this.payerFsp.value;
  }


  /** Convert timestamp to UTC date */
  convertTimestampToUTCDate(timestamp: any) {
    if (!timestamp) {
      return undefined;
    }
    return this.dates.formatUTCDate(new Date(timestamp));
  }


  /** Remove individual filter */
  removeFilter(filterType: string): void {
    (this as any)[filterType].reset();
    this.searchBatches();
  }

  /** Navigate to sub-batches of a batch */
  gotoSubBatches(batchId: string): void {
    this.router.navigate(['..', 'sub-batches', batchId], { relativeTo: this.route });
  }

  /** Toggle filter panel */
  togglePanel(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.panel.toggle();
  }
}