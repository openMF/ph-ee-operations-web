import { Component, OnInit, ViewChild } from '@angular/core';
import { Dates } from 'app/core/utils/dates';
import { VouchersService } from '../services/vouchers.service';
import { UntypedFormControl } from '@angular/forms';
import { VoucherData } from '../models/vouchers-model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'mifosx-voucher-management',
  templateUrl: './voucher-management.component.html',
  styleUrls: ['./voucher-management.component.scss']
})
export class VoucherManagementComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /** Minimum transaction date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum transaction date allowed. */
  maxDate = new Date();
  /** Transaction date from form control. */
  transactionDateFrom = new UntypedFormControl(new Date(new Date().setMonth(new Date().getMonth() - 1)));
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
  totalRows = 0;
  currentPage = 0;

  pageSize = 50;
  isLoading = false;

  constructor(private dates: Dates,
    private vouchersService: VouchersService) { }

  ngOnInit(): void {
    this.getBatches();
  }

  getBatches(): void {
    this.isLoading = true;

    this.vouchersService.getVouchers(this.currentPage, this.pageSize, 'requestFile', 'asc')
    .subscribe((batches: VoucherData) => {
      this.vouchersData = batches;
      this.dataSource = new MatTableDataSource(this.vouchersData.content);
      this.totalRows = batches.totalElements;
      this.isLoading = false;
    });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getBatches();
  }

  convertTimestampToUTCDate(timestamp: any) {
    if (!timestamp) {
      return undefined;
    }
    return this.dates.formatUTCDate(new Date(timestamp));
  }

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

  searchVouchers(): void {

  }

}
