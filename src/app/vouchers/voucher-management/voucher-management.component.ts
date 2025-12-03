/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatExpansionPanel } from '@angular/material/expansion';

/** Custom Models and Utils */
import { Dates } from 'app/core/utils/dates';

/** Custom Services */
import { VouchersService } from '../services/vouchers.service';
import { VoucherData } from '../models/vouchers-model';

/** Voucher Management Component */
@Component({
  selector: 'mifosx-voucher-management',
  templateUrl: './voucher-management.component.html',
  styleUrls: ['./voucher-management.component.scss'],
})
export class VoucherManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
    this.setSortingAccessor();
  }
  @ViewChild('panel') panel: MatExpansionPanel;

  /** Minimum transaction date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum transaction date allowed. */
  maxDate = new Date();
  /** Transaction date from form control. */
  createdDate = new UntypedFormControl();
  /** government Entity form control. */
  governmentEntity = new UntypedFormControl();
  /** serial Number form control. */
  serialNumber = new UntypedFormControl();
  /** functional Id form control. */
  functionalId = new UntypedFormControl();
  /** status form control. */
  status = new UntypedFormControl();

  /** Columns to be displayed in transactions table. */
  displayedColumns: string[] = ['serialNumber', 'createdDate', 'registeringInstitutionId', 'functionalId', 'status'];
  /** Data source for transactions table. */
  dataSource = new MatTableDataSource();

  vouchersData: VoucherData;

  /** Selected filters state. */
  selectedFilters = {
    governmentEntity: false,
    serialNumber: false,
    functionalId: false,
    status: false,
    createdDate: false,
  };

  /** Status options for the status filter. */
  statusOptions = [
    { code: '01', label: 'INACTIVE' },
    { code: '02', label: 'ACTIVE' },
    { code: '03', label: 'CANCELED' },
    { code: '04', label: 'EXPIRED' },
    { code: '05', label: 'UTILIZED' },
    { code: '06', label: 'SUSPENDED' },
  ];

  currentPage = 0;
  pageSize = 50;
  isLoading = false;

  constructor(private dates: Dates, private vouchersService: VouchersService) {}

  ngOnInit(): void {
    this.getBatches();
  }

  getBatches(): void {
    this.isLoading = true;

    this.vouchersService.getVouchers(this.currentPage, this.pageSize, 'requestFile', 'asc').subscribe((batches: VoucherData) => {
      this.vouchersData = batches;
      if (this.vouchersData && this.vouchersData.content) {
        this.dataSource = new MatTableDataSource(this.vouchersData.content);
        this.dataSource.paginator = this.paginator;
      }
      this.isLoading = false;
    });
  }

  /** Set sorting accessor for table columns */
  private setSortingAccessor(): void {
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'governmentEntity':
          return item.registeringInstitutionId;
        case 'serialNumber':
          return item.serialNumber;
        case 'functionalId':
          return item.payeeFunctionalID;
        case 'status':
          return item.status;
        default:
          return item.createdDate;
      }
    };
  }

  /** Convert timestamp to UTC date
   * @param {any} timestamp - The timestamp to be converted
   * @returns {string} - The converted date
   */
  convertTimestampToUTCDate(timestamp: any): string {
    if (!timestamp) {
      return undefined;
    }
    const date = new Date(this.dates.formatUTCDate(new Date(timestamp)));
    return date.toISOString();
  }

  /** Convert timestamp to UTC date
   * @param {any} timestamp - The timestamp to be converted
   * @returns {string} - The converted date
   */
  statusStyle(code: string): string {
    if (code === '01') {
      return 'grey';
    } else if (code === '02') {
      return 'green';
    } else if (code === '03') {
      return 'red';
    } else if (code === '04') {
      return 'blue';
    } else if (code === '05') {
      return 'black';
    } else if (code === '06') {
      return 'orange';
    } else {
      return '';
    }
  }

  /** Convert  status code to human readable status
   * @param {string} code - The status code to be converted
   * @returns {string} - The human readable status
   * */
  validateStatus(code: string): string {
    if (code === '01') {
      return 'INACTIVE';
    } else if (code === '02') {
      return 'ACTIVE';
    } else if (code === '03') {
      return 'CANCELED';
    } else if (code === '04') {
      return 'EXPIRED';
    } else if (code === '05') {
      return 'UTILIZED';
    } else if (code === '06') {
      return 'SUSPENDED';
    } else {
      return '';
    }
  }

  /**
   * Filters the vouchers based on selected filters.
   */
  searchVouchers(): void {
    const filterValues = this.getFilterValues();
    this.applyFilters(filterValues);
    this.updateSelectedFilters();
    this.panel.close();
  }

  /**
   * Retrieve and format filter values from the form controls.
   */
  private getFilterValues(): any {
    const stripTime = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return {
      governmentEntity: this.governmentEntity.value ? this.governmentEntity.value.trim().toLowerCase() : '',
      serialNumber: this.serialNumber.value ? this.serialNumber.value.trim().toLowerCase() : '',
      functionalId: this.functionalId.value ? this.functionalId.value.trim().toLowerCase() : '',
      status: this.status.value ? this.status.value.trim().toLowerCase() : '',
      createdDate: this.createdDate.value ? stripTime(new Date(this.createdDate.value)) : null,
    };
  }

  /**
   * Apply filter criteria to the data source based on the user input.
   * @param filterValues - The values to be used for filtering
   */
  private applyFilters(filterValues: any): void {
    const stripTime = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchTerms = JSON.parse(filter);

      // Check if the filter createdDate is valid
      const filterCreatedDate = searchTerms.createdDate ? new Date(searchTerms.createdDate) : null;

      return (
        (!filterCreatedDate || stripTime(new Date(data.createdDate)).getTime() === filterCreatedDate.getTime()) &&
        data.registeringInstitutionId.toLowerCase().includes(searchTerms.governmentEntity) &&
        data.serialNumber.toLowerCase().includes(searchTerms.serialNumber) &&
        data.payeeFunctionalID.toLowerCase().includes(searchTerms.functionalId) &&
        data.status.toLowerCase().includes(searchTerms.status)
      );
    };

    this.dataSource.filter = JSON.stringify(filterValues);
  }

  /**
   * Update the state of the selected filters for UI toggling.
   */
  private updateSelectedFilters(): void {
    this.selectedFilters.governmentEntity = !!this.governmentEntity.value;
    this.selectedFilters.serialNumber = !!this.serialNumber.value;
    this.selectedFilters.functionalId = !!this.functionalId.value;
    this.selectedFilters.status = !!this.status.value;
    this.selectedFilters.createdDate = !!this.createdDate.value;
  }

  /** Clear a filter 
   * @param {string} filterType - The filter type to be cleared
   * @param {MouseEvent} event - The mouse event that triggered the action
   * */
  removeFilter(filterType: string, event?: MouseEvent): void {
    event?.stopPropagation();
    (this as any)[filterType].reset();
    this.searchVouchers();
  }

  /** Toggle the panel to view search form
   * @param {MouseEvent} event - The mouse event that triggered the action
   * */
  togglePanel(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.panel.toggle();
  }
}
