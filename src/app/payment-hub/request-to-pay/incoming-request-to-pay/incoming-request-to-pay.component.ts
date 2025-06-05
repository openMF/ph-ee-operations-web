/** Angular Imports */
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { requestInterface } from "./incoming-request-to-pay-interface";
import {
  tap,
  distinctUntilChanged,
  debounceTime,
  startWith,
  map,
} from "rxjs/operators";

/** Custom Services */
import { RequestToPayService } from "../service/request-to-pay.service";
import { RequestToPayDataSource } from "../dataSource /requestToPay.datasource";
/** Custom Data Source */
import { formatUTCDate } from "../helper/date-format.helper";
import { transactionStatusData as statuses } from "../helper/incoming-reqest.helper";

import { DfspEntry } from "../model/dfsp.model";
import { amsShortCodes } from "../helper/ams-short-codes";

@Component({
  selector: "mifosx-incoming-request-to-pay",
  templateUrl: "./incoming-request-to-pay.component.html",
  styleUrls: ["./incoming-request-to-pay.component.scss"],
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
  transactionStatusData = statuses;
  amsCodes = amsShortCodes('TILL');
  /** Transaction date from form control. */
  transactionDateFrom = new FormControl();
  /** Transaction date to form control. */
  transactionDateTo = new FormControl();
  /** Transaction ID form control. */
  transactionId = new FormControl();
  externalId = new FormControl();
  csvExport: [];
  csvName: string;

  /** Columns to be displayed in request to pay table. */
  displayedColumns: string[] = [
    "startedAt",
    "completedAt",
    "transactionId",
    "payerPartyId",
    "payeePartyId",
    "payerDfspId",
    "payerDfspName",
    "amount",
    "currency",
    "state",
  ];
  /** Data source for request to pay table. */
  dataSource: RequestToPayDataSource;

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  filterTransactionsBy = [
    {
      type: "payeePartyId",
      value: "",
    },
    {
      type: "payerPartyId",
      value: "",
    },
    {
      type: "payerDfspId",
      value: "",
    },
    {
      type: "direction",
      value: "INCOMING",
    },
    {
      type: "transactionId",
      value: "",
    },
    {
      type: "state",
      value: "",
    },
    {
      type: "amount",
      value: "",
    },
    {
      type: "currency",
      value: "",
    },
    {
      type: "startFrom",
      value: "",
    },
    {
      type: "startTo",
      value: "",
    },
    {
      type: "externalId",
      value: "",
    },
    {
      type: 'payerDfspId',
      value: ''
    }
  ];
  dateTimeFormat = "YYYY-MM-DD HH:mm:ss";

  /** Paginator for requesttopay table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for requesttopay table. */
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private requestToPayService: RequestToPayService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.route.data.subscribe(
      (data: {
        dfspEntries: DfspEntry[];
        currencies: any;
      }) => {
        this.currenciesData = data.currencies;
        this.dfspEntriesData = data.dfspEntries;
      }
    );
  }

  ngOnInit() {
    this.getRequestsPay();
    this.setFilteredCurrencies();
  }

  /**
   * Sets filtered gl accounts for autocomplete.
   */
  setFilteredCurrencies() {
    this.filteredCurrencies = this.currencyCode.valueChanges
      .pipe(
        startWith(''),
        map((currency: any) => typeof currency === 'string' ? currency : currency.Currency + ' (' + currency.AlphabeticCode + ')'),
        map((currency: string) => currency ? this.filterCurrencyAutocompleteData(currency) : this.currenciesData)
      );
  }

  /**
   * Filters gl accounts.
   * @param {string} glAccount Gl Account name to filter gl account by.
   * @returns {any} Filtered gl accounts.
   */
  private filterCurrencyAutocompleteData(currency: string): any {
    return this.currenciesData.filter((option: any) => (option.Currency + ' (' + option.AlphabeticCode + ')').toLowerCase().includes(currency.toLowerCase()));
  }

  
  ngAfterViewInit() {
    this.paginator.page
      .pipe(tap(() => this.loadTransactionsPage()))
      .subscribe();
    this.payeePartyId.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          if (filterValue.length == 0 || filterValue.length > 3)
            this.applyFilter(filterValue, "payeePartyId");
        })
      )
      .subscribe();

    this.payerPartyId.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          if (filterValue.length == 0 || filterValue.length > 3)
            this.applyFilter(filterValue, "payerPartyId");
        })
      )
      .subscribe();

    this.payerDfspId.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "payerDfspId");
        })
      )
      .subscribe();

    this.payerDfspName.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          const elements = this.dfspEntriesData.filter(
            (option) => option.name === filterValue.name
          );
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
          if (filterValue.length > 5) {
            this.applyFilter(filterValue, "transactionId");
          }
        })
      )
      .subscribe();

    this.status.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "state");
        })
      )
      .subscribe();

    this.amount.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "amount");
        })
      )
      .subscribe();

    this.currencyCode.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          filterValue = filterValue.AlphabeticCode;
          if('KES' === filterValue){
            filterValue = 'KE'
          }
          this.applyFilter(filterValue, "currency");
        })
      )
      .subscribe();

    this.transactionDateFrom.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue: moment.Moment) => {
          if (filterValue) {
            this.applyFilter(filterValue.format(this.dateTimeFormat), "startFrom");
          }
        })
      )
      .subscribe();

    this.transactionDateTo.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue: moment.Moment) => {
          if (filterValue) {
            this.applyFilter(filterValue.format(this.dateTimeFormat), "startTo");
          }
        })
      )
      .subscribe();

    this.externalId.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          if (filterValue.length == 0 || filterValue.length > 3)
            this.applyFilter(filterValue, "externalId");
        })
      )
      .subscribe();

    // this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  loadTransactionsPage() {
    // if (!this.sort.direction) {
    //   delete this.sort.active;
    // }
    this.dataSource.getRequestsPay(
      this.filterTransactionsBy,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }
  /**
   * Initializes the data source, paginator and sorter for request to pay table.
   */
  // setRequestToPay() {
  //   this.dataSource = new MatTableDataSource(this.requestToPayIncomingData);
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  convertTimestampToUTCDate(timestamp: any) {
    if (!timestamp) {
      return undefined;
    }
    return formatUTCDate(new Date(timestamp));
  }

  formatDate(date: string) {
    if (!date) {
      return undefined;
    }
    var date2 = new Date(date);
    const year = date2.getFullYear();
    const month = "0" + (date2.getMonth() + 1);
    const day = "0" + date2.getDate();
    // Hours part from the timestamp
    const hours = "0" + date2.getHours();
    // Minutes part from the timestamp
    const minutes = "0" + date2.getMinutes();
    // Seconds part from the timestamp
    const seconds = "0" + date2.getSeconds();

    // Will display time in 2020-04-10 18:04:36 format
    return (
      year +
      "-" +
      month.substr(-2) +
      "-" +
      day.substr(-2) +
      "  " +
      hours.substr(-2) +
      ":" +
      minutes.substr(-2) +
      ":" +
      seconds.substr(-2)
    );
  }

  shortenValue(value: any) {
    return value && value.length > 15 ? value.slice(0, 13) + "..." : value;
  }

  displayCurrencyName(currency?: any): string | undefined {
    return currency
      ? currency.Currency + " (" + currency.AlphabeticCode + ")"
      : undefined;
  }

  getDfpsEntry(dfpsId?: any): DfspEntry | undefined {
    const elements = this.dfspEntriesData.filter(
      (option) => option.id === dfpsId
    );
    return elements.length > 0 ? elements[0] : undefined;
  }
  /**
   * Filters data in transactions table based on passed value and poperty.
   * @param {string} filterValue Value to filter data.
   * @param {string} property Property to filter data by.
   */
  applyFilter(filterValue: string, property: string) {
    this.paginator.pageIndex = 0;
    const findIndex = this.filterTransactionsBy.findIndex(
      (filter) => filter.type === property
    );
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
  exportCSV(filterBy: any) {
    filterBy[filterBy.cars] = filterBy.val;
    this.requestToPayService.exportCSV(filterBy);
  }
  /**
   * Displays office name in form control input.
   * @param {any} office Office data.
   * @returns {string} Office name if valid otherwise undefined.
   */
  displayStatus(status?: any): string | undefined {
    const elements = this.transactionStatusData.filter(
      (option) => option.value === status
    );
    return elements.length > 0 ? elements[0].option : undefined;
  }

  displayCSS(status?: any): string | undefined {
    const elements = this.transactionStatusData.filter(
      (option) => option.value === status
    );
    return elements.length > 0 ? elements[0].css : undefined;
  }
  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == "undefined") {
      alert("Please disable your Pop-up blocker and try again.");
    }
  }
  getRequestsPay() {
    this.dataSource = new RequestToPayDataSource(this.requestToPayService);
    this.dataSource.getRequestsPay(this.filterTransactionsBy);
  }
}
