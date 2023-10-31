import { Component, ViewChild } from '@angular/core';
import { AccountMapperService } from '../services/account-mapper.service';
import { UntypedFormControl } from '@angular/forms';
import { TransactionsDataSource } from 'app/payment-hub/transactions/dataSource/transactions.datasource';
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
export class AccountMapperComponent {

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
  displayedColumns: string[] = ['governmentEntity', 'financialInstitution', 'functionalId', 'financialAddress'];
  /** Data source for transactions table. */
  dataSource = new MatTableDataSource();

  totalRows: number = 0;
  currentPage: number = 0;

  pageSize = 50;
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
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAccounts();
  }

  searchAccounts(): void {

  }
}
