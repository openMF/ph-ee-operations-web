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
  dataSource=new MatTableDataSource<requestInterface>(this.requestToPayIncomingData);


  filteredValues = { payerPartyId:'' , amount: '',payerDfspId:'', transactionId: ''};
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
  }
  
  ngOnInit() {
    
    this.setRequestToPay();
    this.payerPartyId.valueChanges.subscribe((payerPartyIdFilterValue)        => {
      this.filteredValues['payerPartyId'] = payerPartyIdFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      });
      this.amount.valueChanges.subscribe((amountFilterValue)        => {
        this.filteredValues['amount'] = amountFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        });
        this.payerDfspId.valueChanges.subscribe((payerDfspIdFilterValue)        => {
          this.filteredValues['payerDfspId'] = payerDfspIdFilterValue;
          this.dataSource.filter = JSON.stringify(this.filteredValues);
          });
          this.transactionId.valueChanges.subscribe((transactionIdFilterValue)        => {
            this.filteredValues['transactionId'] = transactionIdFilterValue;
            this.dataSource.filter = JSON.stringify(this.filteredValues);
            });
      this.dataSource.filterPredicate = this.customFilterPredicate();
    //console.log(this.dataSource);
  }
  
  /**
   * Initializes the data source, paginator and sorter for request to pay table.
   */
  setRequestToPay() {
    this.dataSource = new MatTableDataSource(this.requestToPayIncomingData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
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
    date=date.toString();
    date = date.replace('+0000', '');
    date = date.replace('T', ' ');
    date = date.replace('.000', '');
    return date;
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
   * Displays office name in form control input.
   * @param {any} office Office data.
   * @returns {string} Office name if valid otherwise undefined.
   */
  displayDfspName(entry?: any): string | undefined {
    return entry ? entry.name : undefined;
  }
  customFilterPredicate() {
    const myFilterPredicate = function(data:requestInterface, filter:string) :boolean {
      let searchString = JSON.parse(filter);
      let payerPartyIdFound = data.payerPartyId.toString().trim().indexOf(searchString.payerPartyId) !== -1
      let amountFound = data.amount.toString().trim().indexOf(searchString.amount) !== -1
      let transactionIdFound = data.transactionId.toString().trim().indexOf(searchString.transactionId) !== -1
      if (searchString.topFilter) {
          return  payerPartyIdFound  || amountFound || transactionIdFound
      } else {
          return payerPartyIdFound && amountFound && transactionIdFound
      }
    }
    return myFilterPredicate;
  }
}
