/** Angular Imports */
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

/** rxjs Imports */
import { merge, of } from 'rxjs';

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
  
  /* Requests to pay data. */
  requestToPayData: any;
  /* Requests to incoming data. */
  requestToPayIncomingData: Array<any> = [];

  /** Columns to be displayed in request to pay table. */
  displayedColumns: string[] = ['startedAt', 'completedAt', 'transactionId', 'payerPartyId', 'payeePartyId', 'payerDfspId','payerDfspName', 'amount', 'currency', 'state'];

  /** Data source for request to pay table. */
  dataSource: MatTableDataSource<any>;

  dfspEntriesData:  DfspEntry[];
  currenciesData: any;
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

}
