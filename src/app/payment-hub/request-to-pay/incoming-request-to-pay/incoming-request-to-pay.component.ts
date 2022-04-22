/** Angular Imports */
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {requestInterface} from './incoming-request-to-pay-interface'
/** rxjs Imports */
import { merge } from 'rxjs';
import { tap, startWith, map, distinctUntilChanged, debounceTime } from 'rxjs/operators';

/** Custom Services */
import { RequestToPayService } from '../service/request-to-pay.service';
import { RequestToPayDataSource} from '../dataSource /requestToPay.datasource'

/** Custom Data Source */
import { formatDate } from '../helper/date-format.helper';

import { DfspEntry } from '../model/dfsp.model';

@Component({
  selector: 'mifosx-incoming-request-to-pay',
  templateUrl: './incoming-request-to-pay.component.html',
  styleUrls: ['./incoming-request-to-pay.component.scss']
})
export class IncomingRequestToPayComponent implements OnInit {

  /** Minimum transaction date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum transaction date allowed. */
  maxDate = new Date();
  payeePartyId = new FormControl();
  payerPartyId = new FormControl();
  payerDfspId = new FormControl();
  payerDfspName = new FormControl();
  status = new FormControl();
  amount = new FormControl();
  currencyCode = new FormControl();
  filteredCurrencies: any;
  filteredDfspEntries: any;
  currenciesData: any;
  dfspEntriesData: DfspEntry[];
  /** Transaction date from form control. */
  transactionDateFrom = new FormControl();
  /** Transaction date to form control. */
  transactionDateTo = new FormControl();
  /** Transaction ID form control. */
  transactionId = new FormControl();
  /* Requests to pay data. */
  requestToPayData: any;
  /* Requests to incoming data. */
  requestToPayIncomingData: requestInterface[]=[];

  /** Columns to be displayed in request to pay table. */
  displayedColumns: string[] = ['startedAt', 'completedAt', 'transactionId', 'payerPartyId', 'payeePartyId', 'payerDfspId','payerDfspName', 'amount', 'currency', 'state'];
  
  /** Data source for request to pay table. */
  dataSource: RequestToPayDataSource;
  filterTransactionsBy = [
    {
      type: 'payeePartyId',
      value: ''
    },
    {
      type: 'payerPartyId',
      value: ''
    },
    {
      type: 'payerDfspId',
      value: ''
    },
    {
      type: 'direction',
      value: 'INCOMING'
    },
    {
      type: 'transactionId',
      value: ''
    },
    {
      type: 'status',
      value: ''
    },
    {
      type: 'amount',
      value: ''
    },
    {
      type: 'currency',
      value: ''
    },
    {
      type: 'startFrom',
      value: ''
    },
    {
      type: 'startTo',
      value: ''
    }
  ];

  /** Paginator for requesttopay table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for requesttopay table. */
  @ViewChild(MatSort) sort: MatSort;

  constructor(private requestToPayService: RequestToPayService,
  	private route: ActivatedRoute,
    public dialog: MatDialog) { 
    this.route.data.subscribe((data: { requestsToPay: any,dfspEntries: DfspEntry[],currencies: any }) => {
      this.requestToPayData = data.requestsToPay.content;
      this.currenciesData = data.currencies;
      this.dfspEntriesData = data.dfspEntries;
    });
    for(let request of this.requestToPayData) {
      if(request.direction==="INCOMING")
        this.requestToPayIncomingData.push(request);
    };
    console.log(this.requestToPayIncomingData);
    console.log(this.dataSource)
  }
  
  ngOnInit() {
    
    // this.setRequestToPay();
    //console.log(this.dataSource);
    // this.dataSource.getRequestsPay(this.filterTransactionsBy , this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
    this.getRequestsPay();
  }
  ngAfterViewInit() {
    this.payeePartyId.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'payeePartyId');

        })
      )
      .subscribe();

    this.payerPartyId.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'payerPartyId');
        })
      )
      .subscribe();

    this.payerDfspId.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'payerDfspId');
        })
      )
      .subscribe();

    this.payerDfspName.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          const elements = this.dfspEntriesData.filter((option) => option.name === filterValue.name);
          if (elements.length === 1) {
            this.payerDfspId.setValue(elements[0].id);
            filterValue = elements[0].name;
          }
        })
      )
      .subscribe();

    this.transactionId.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'transactionId');
        })
      )
      .subscribe();

    this.status.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'status');
        })
      )
      .subscribe();

    this.amount.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'amount');
        })
      )
      .subscribe();

    this.currencyCode.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          filterValue = filterValue.AlphabeticCode;
          this.applyFilter(filterValue, 'currency');
        })
      )
      .subscribe();

    this.transactionDateFrom.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          if(filterValue) {
            this.applyFilter(filterValue, 'startFrom');
            console.log(filterValue);
          }
        })
      )
      .subscribe();

    this.transactionDateTo.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          if(filterValue) {
            this.applyFilter(filterValue, 'startTo');
          }
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadTransactionsPage())
      )
      .subscribe();
  }
  loadTransactionsPage() {
    if (!this.sort.direction) {
      delete this.sort.active;
    }
    this.dataSource.getRequestsPay(this.filterTransactionsBy, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
    
  }
  /**
   * Initializes the data source, paginator and sorter for request to pay table.
   */
  // setRequestToPay() {
  //   this.dataSource = new MatTableDataSource(this.requestToPayIncomingData);
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }
  
  convertTimestampToDate(timestamp: any) {
    if (!timestamp) {
      return undefined;
    }
    return formatDate(new Date(timestamp));
  }

  formatDate(date: string) {
    if (!date) {
      return undefined;
    }
    var date2 = new Date(date);
    const year = date2.getFullYear();
    const month = '0' + (date2.getMonth() + 1);
    const day = '0' + date2.getDate();
    // Hours part from the timestamp
    const hours = '0' + date2.getHours();
    // Minutes part from the timestamp
    const minutes = '0' + date2.getMinutes();
    // Seconds part from the timestamp
    const seconds = '0' + date2.getSeconds();

    // Will display time in 2020-04-10 18:04:36 format
    return year + '-' + month.substr(-2) + '-' + day.substr(-2) + '  ' +hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }



  shortenValue(value: any) {
    return value && value.length > 15 ? value.slice(0, 13) + '...' : value;
  }

  displayCurrencyName(currency?: any): string | undefined {
    return currency ? currency.Currency + ' (' + currency.AlphabeticCode + ')' : undefined;
  }

  getDfpsEntry(dfpsId?: any): DfspEntry | undefined {
    const elements = this.dfspEntriesData.filter((option) => option.id === dfpsId);
    return elements.length > 0 ? elements[0] : undefined;
  }
  /**
   * Filters data in transactions table based on passed value and poperty.
   * @param {string} filterValue Value to filter data.
   * @param {string} property Property to filter data by.
   */
   applyFilter(filterValue: string, property: string) {
    this.paginator.pageIndex = 0;
    const findIndex = this.filterTransactionsBy.findIndex(filter => filter.type === property);
    this.filterTransactionsBy[findIndex].value = filterValue;
    this.loadTransactionsPage();
  }
  /**
   * Displays office name in form control input.
   * @param {any} office Office data.
   * @returns {string} Office name if valid otherwise undefined.
   */
  displayDfspName(entry?: any): string | undefined {
    return entry ? entry.name : undefined;
  }
  
  getRequestsPay(){
    this.dataSource = new RequestToPayDataSource(this.requestToPayService);
    console.log(this.dataSource);
    this.dataSource.getRequestsPay(this.filterTransactionsBy);

  }
}
