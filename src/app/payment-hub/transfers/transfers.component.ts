/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatSort } from '@angular/material/sort';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

/** Custom Models and Utils */
import { Dates } from 'app/core/utils/dates';
import { SubBatchDetail, Transfer, TransferData } from './model/transfer.model';

/** Custom Services */
import { TransfersService } from './transfers.service';

/** Custom Components */
import { ViewTransferDetailsComponent } from './view-transfer-details/view-transfer-details.component';
import { SubBatchSummaryComponent } from './sub-batch-summary/sub-batch-summary.component';

@Component({
  selector: 'mifosx-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss'],
})
export class TransfersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
    this.setSortingAccessor();
  }
  @ViewChild('panel') panel: MatExpansionPanel;

  /** Amount form control */
  amount = new UntypedFormControl();
  /** Date form control */
  date = new UntypedFormControl();
  /** Transaction ID form control */
  transactionId = new UntypedFormControl();
  /** Transaction Status form control */
  transactionStatus = new UntypedFormControl();
  /** Functional ID form control */
  functionalId = new UntypedFormControl();

  /** Transactions Status */
  transactionStatuses = ['Completed', 'Rejected', 'Partially Authorized'];

  /** Selected filters state */
  selectedFilters = {
    amount: false,
    date: false,
    transactionId: false,
    transactionStatus: false,
    functionalId: false,
  };

  /** Table Columns */
  displayedColumns: string[] = ['transactionReferenceNumber', 'date', 'bulkAmount', 'functionalId', 'status'];
  /** Data source for transactions table */
  dataSource = new MatTableDataSource<Transfer>();

  totalRows = 0;
  currentPage = 0;
  pageSize = 50;
  isLoading = false;

  batchId: string;
  subBatchId: string;
  transferData: any;
  subBatchData: SubBatchDetail;

  constructor(
    private route: ActivatedRoute,
    private dates: Dates,
    private dialog: MatDialog,
    private transfersService: TransfersService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.batchId = params.batchId;
      this.subBatchId = params.subBatchId;
    });
    this.getTransfers();
  }

  /** Load transfers or sub-batch details based on subBatchId */
  getTransfers(): void {
    this.isLoading = true;
    if (!this.subBatchId) {
      this.transfersService.getTransfers(this.currentPage, this.pageSize).subscribe(
        (data: TransferData) => this.handleTransfersResponse(data),
        () => (this.isLoading = false)
      );
    } else {
      this.transfersService.getSubBatchSumaryDetail(this.batchId, this.subBatchId).subscribe(
        (data: SubBatchDetail) => this.handleSubBatchResponse(data),
        () => (this.isLoading = false)
      );
    }
  }

  /** Handle transfers response */
  private handleTransfersResponse(data: TransferData): void {
    this.transferData = data.content;
    this.updateDataSource(this.transferData);
    this.totalRows = data.totalElements;
    this.isLoading = false;
  }

  /** Handle sub-batch response */
  private handleSubBatchResponse(data: SubBatchDetail): void {
    this.subBatchData = { ...data, instructionList: null };
    this.transferData = data.instructionList;
    this.updateDataSource(this.transferData);
    this.totalRows = data.totalInstructionCount;
    this.isLoading = false;
  }

  /** Set sorting accessor for table columns */
  private setSortingAccessor(): void {
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'date': return new Date(item.date);
        case 'bulkAmount': return item.amount;
        case 'status': return item.status;
        case 'functionalId': return item.functionalId;
        case 'transactionReferenceNumber': return item.transactionId;
        default: return item[property];
      }
    };
  }

  /** Format date to UTC */
  convertTimestampToUTCDate(timestamp: any): string | undefined {
    return timestamp ? this.dates.formatUTCDate(new Date(timestamp)) : undefined;
  }

  /** Update pagination */
  pageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getTransfers();
  }

  /** Search and filter transactions */
  searchTransactions(): void {
    const filterData = this.filterTransferData();
    this.updateDataSource(filterData);
    this.updateSelectedFilters();
    this.panel.close();
  }

  /** Filter transfer data based on form controls */
  private filterTransferData(): Transfer[] {
    const stripTime = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const date = this.date.value ? stripTime(new Date(this.date.value)) : null;

    return this.transferData.filter((item: any) => {
      const datadate = stripTime(new Date(item.date));
      const matchesDate = !date || datadate.getTime() === date.getTime();
      const matchesTransactionId = !this.transactionId.value || (item.transactionId || item.instructionId).toLowerCase().includes(this.transactionId.value.toLowerCase());
      const matchesStatus = !this.transactionStatus.value || item.status.toLowerCase().includes(this.transactionStatus.value.toLowerCase());
      const matchesFunctionalId = !this.functionalId.value || item.functionalId.toLowerCase().includes(this.functionalId.value.toLowerCase());
      const matchesAmount = !this.amount.value || item.amount === this.amount.value;

      return matchesDate && matchesTransactionId && matchesStatus && matchesFunctionalId && matchesAmount;
    });
  }

  /** Update the data source */
  private updateDataSource(data: Transfer[]): void {
    this.dataSource.data = data;
    this.dataSource.paginator = this.paginator;
  }

  /** Update the selected filters state */
  private updateSelectedFilters(): void {
    this.selectedFilters.transactionId = !!this.transactionId.value;
    this.selectedFilters.transactionStatus = !!this.transactionStatus.value;
    this.selectedFilters.amount = !!this.amount.value;
    this.selectedFilters.functionalId = !!this.functionalId.value;
    this.selectedFilters.date = !!this.date.value;
  }

  /** Clear a filter */
  removeFilter(filterType: string, event?: MouseEvent): void {
    event?.stopPropagation();
    (this as any)[filterType].reset();
    this.searchTransactions();
  }

  /** View transfer details */
  viewTransfer(transfer: Transfer): void {
    this.dialog.open(ViewTransferDetailsComponent, { data: { transfer } });
  }

  /** Toggle the filter panel */
  togglePanel(event?: MouseEvent): void {
    event?.stopPropagation();
    this.panel.toggle();
  }

  /** View sub-batch summary */
  viewSummary(): void {
    this.dialog.open(SubBatchSummaryComponent, { data: { subBatch: this.subBatchData } });
  }
}
