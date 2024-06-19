import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountMapperService } from '../services/account-mapper.service';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AccountData } from '../models/account-mapper.model';
import { Dates } from 'app/core/utils/dates';

@Component({
  selector: 'mifosx-account-mapper',
  templateUrl: './account-mapper.component.html',
  styleUrls: ['./account-mapper.component.scss']
})
export class AccountMapperComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /** government Entity form control. */
  governmentEntity = new UntypedFormControl();
  /** financial Institution form control. */
  financialInstitution = new UntypedFormControl();
  /** functional Id form control. */
  functionalId = new UntypedFormControl();
  /** financial Address form control. */
  financialAddress = new UntypedFormControl();

  /** Columns to be displayed in transactions table. */
  displayedColumns: string[] = ['governmentEntity', 'financialInstitution', 'functionalId', 'financialAddress', 'paymentModality'];
  /** Data source for transactions table. */
  dataSource = new MatTableDataSource();

  totalRows = 0;
  currentPage = 0;
  pageSize = 10;
  isLoading = false;

  accountsData: AccountData;

  constructor(private dates: Dates,
    private accountMapperService: AccountMapperService) { }

  ngOnInit(): void {
    this.getAccounts();
  }

  getAccounts(): void {
    this.isLoading = true;
    this.accountMapperService.getAccounts(this.currentPage, this.pageSize, 'requestFile', 'asc')
    .subscribe((accounts: AccountData) => {
      this.dataSource = new MatTableDataSource(accounts.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.totalRows = accounts.totalElements;
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
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAccounts();
  }

  paymentModalityDescription(value: string): string {
    if (value === '0' || value === '00') {
      return '(00) Bank Account';
    } else if (value === '1' || value === '01') {
      return '(01) Mobile Money';
    } else if (value === '2' || value === '02') {
      return '(02) Voucher';
    } else if (value === '3' || value === '03') {
      return '(03) Digital Wallet';
    } else if (value === '4' || value === '04') {
      return '(04) Proxy';
    }
    return value;
  }

  searchAccounts(): void {

  }
}
