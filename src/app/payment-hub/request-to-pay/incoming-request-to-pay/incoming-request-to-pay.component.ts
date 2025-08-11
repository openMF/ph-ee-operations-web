/** Angular Imports */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  tap,
} from 'rxjs/operators';

/** Custom Services */
import { MatomoService } from 'app/core/analytics/matomo.service';
import { RequestToPayDataSource } from '../dataSource/requestToPay.datasource';
import { RequestToPayService } from '../service/request-to-pay.service';
/** Custom Data Source */
import { formatUTCDate } from '../helper/date-format.helper';
import { transactionStatusData as statuses } from '../helper/incoming-reqest.helper';

import { amsShortCodes } from '../helper/ams-short-codes';
import { DfspEntry } from '../model/dfsp.model';

@Component({
  selector: 'mifosx-incoming-request-to-pay',
  templateUrl: './incoming-request-to-pay.component.html',
  styleUrls: ['./incoming-request-to-pay.component.scss'],
})
export class IncomingRequestToPayComponent implements OnInit, AfterViewInit {
  /** Minimum transaction date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum transaction date allowed. */
  maxDate = new Date();
  payeePartyId = new UntypedFormControl();
  payerPartyId = new UntypedFormControl();
  payerDfspId = new UntypedFormControl();
  payerDfspName = new UntypedFormControl();
  status = new UntypedFormControl();
  amount = new UntypedFormControl();
  currencyCode = new UntypedFormControl();
  filteredCurrencies: any;
  filteredDfspEntries: any;
  currenciesData: any;
  dfspEntriesData: DfspEntry[];
  transactionStatusData = statuses;
  amsCodes = amsShortCodes('TILL');
  /** Transaction date from form control. */
  transactionDateFrom = new UntypedFormControl();
  /** Transaction date to form control. */
  transactionDateTo = new UntypedFormControl();
  /** Transaction ID form control. */
  transactionId = new UntypedFormControl();
  externalId = new UntypedFormControl();
  csvExport: [];
  csvName: string;

  /** Columns to be displayed in request to pay table. */
  displayedColumns: string[] = [
    'startedAt',
    'completedAt',
    'transactionId',
    'payerPartyId',
    'payeePartyId',
    'payerDfspId',
    'payerDfspName',
    'amount',
    'currency',
    'state',
  ];
  /** Data source for request to pay table. */
  dataSource: RequestToPayDataSource;

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  filterTransactionsBy = [
    {
      type: 'payeePartyId',
      value: '',
    },
    {
      type: 'payerPartyId',
      value: '',
    },
    {
      type: 'payerDfspId',
      value: '',
    },
    {
      type: 'direction',
      value: 'INCOMING',
    },
    {
      type: 'transactionId',
      value: '',
    },
    {
      type: 'state',
      value: '',
    },
    {
      type: 'amount',
      value: '',
    },
    {
      type: 'currency',
      value: '',
    },
    {
      type: 'startFrom',
      value: '',
    },
    {
      type: 'startTo',
      value: '',
    },
    {
      type: 'externalId',
      value: '',
    },
    {
      type: 'payerDfspId',
      value: '',
    },
  ];
  dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

  /** Paginator for requesttopay table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for requesttopay table. */
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private requestToPayService: RequestToPayService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private matomoService: MatomoService
  ) {
    this.route.data.subscribe(
      (data: { dfspEntries: DfspEntry[]; currencies: any }) => {
        this.currenciesData = data.currencies;
        this.dfspEntriesData = data.dfspEntries;
      }
    );
  }

  ngOnInit() {
    this.trackPageView();
    this.setupAnalytics();
    this.getRequestsPay();
    this.setFilteredCurrencies();
  }

  /**
   * Sets filtered gl accounts for autocomplete.
   */
  setFilteredCurrencies() {
    this.filteredCurrencies = this.currencyCode.valueChanges.pipe(
      startWith(''),
      map((currency: any) =>
        typeof currency === 'string'
          ? currency
          : currency.Currency + ' (' + currency.AlphabeticCode + ')'
      ),
      map((currency: string) =>
        currency
          ? this.filterCurrencyAutocompleteData(currency)
          : this.currenciesData
      )
    );
  }

  /**
   * Filters gl accounts.
   * @param {string} glAccount Gl Account name to filter gl account by.
   * @returns {any} Filtered gl accounts.
   */
  private filterCurrencyAutocompleteData(currency: string): any {
    return this.currenciesData.filter((option: any) =>
      (option.Currency + ' (' + option.AlphabeticCode + ')')
        .toLowerCase()
        .includes(currency.toLowerCase())
    );
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
          if (filterValue.length === 0 || filterValue.length > 3) {
            this.applyFilter(filterValue, 'payeePartyId');
          }
        })
      )
      .subscribe();

    this.payerPartyId.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          if (filterValue.length === 0 || filterValue.length > 3) {
            this.applyFilter(filterValue, 'payerPartyId');
          }
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
            this.applyFilter(filterValue, 'transactionId');
          }
        })
      )
      .subscribe();

    this.status.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'state');
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
          if ('KES' === filterValue) {
            filterValue = 'KE';
          }
          this.applyFilter(filterValue, 'currency');
        })
      )
      .subscribe();

    this.transactionDateFrom.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue: moment.Moment) => {
          if (filterValue) {
            this.applyFilter(
              filterValue.format(this.dateTimeFormat),
              'startFrom'
            );
          } else {
            this.applyFilter('', 'startFrom');
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
            this.applyFilter(
              filterValue.format(this.dateTimeFormat),
              'startTo'
            );
          } else {
            this.applyFilter('', 'startTo');
          }
        })
      )
      .subscribe();

    this.externalId.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          if (filterValue.length === 0 || filterValue.length > 3) {
            this.applyFilter(filterValue, 'externalId');
          }
        })
      )
      .subscribe();

    // this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  loadTransactionsPage() {
    const startTime = performance.now();

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

    // Track performance
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    this.trackPerformanceMetric('Load Transactions Page', duration);

    // Track pagination if triggered by pagination
    if (this.paginator.pageIndex !== undefined) {
      this.onPageChange(this.paginator.pageIndex, this.paginator.pageSize);
    }
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
    const date2 = new Date(date);
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
    return (
      year +
      '-' +
      month.substr(-2) +
      '-' +
      day.substr(-2) +
      '  ' +
      hours.substr(-2) +
      ':' +
      minutes.substr(-2) +
      ':' +
      seconds.substr(-2)
    );
  }

  shortenValue(value: any) {
    return value && value.length > 15 ? value.slice(0, 13) + '...' : value;
  }

  displayCurrencyName(currency?: any): string | undefined {
    return currency
      ? currency.Currency + ' (' + currency.AlphabeticCode + ')'
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

    // Track filter usage
    this.onFilterUsed(property, filterValue);

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
    const startTime = performance.now();

    try {
      filterBy[filterBy.cars] = filterBy.val;

      // Track export usage
      this.onExportUsed(filterBy.cars, filterBy.val);

      this.requestToPayService.exportCSV(filterBy);

      // Track successful export
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      this.matomoService.trackEvent(
        'Export',
        'Success',
        'Request to Pay CSV',
        1
      );
      this.trackPerformanceMetric('CSV Export', duration);
    } catch (error) {
      this.matomoService.trackEvent('Export', 'Error', 'Request to Pay CSV', 1);
      this.trackBusinessMetric('export_errors', 1, 'errors');
    }
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
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed === 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }
  getRequestsPay() {
    this.dataSource = new RequestToPayDataSource(this.requestToPayService);
    this.dataSource.getRequestsPay(this.filterTransactionsBy);
  }

  /**
   * Track page view for incoming request to pay
   */
  trackPageView(): void {
    this.matomoService.trackPageView(
      'Incoming Request to Pay',
      '/payment-hub/request-to-pay/incoming'
    );
  }

  /**
   * Setup initial analytics configuration
   */
  setupAnalytics(): void {
    this.matomoService.trackEvent(
      'Page',
      'Loaded',
      'Incoming Request to Pay',
      1
    );
    this.trackBusinessMetric('request_to_pay_views', 1, 'views');
  }

  /**
   * Track filter interactions
   */
  onFilterUsed(filterType: string, value?: any): void {
    this.matomoService.trackEvent(
      'Filter',
      'Used',
      `Request to Pay ${filterType}`,
      1
    );

    if (value) {
      this.matomoService.trackEvent(
        'Filter',
        'Value Set',
        `Request to Pay ${filterType}`,
        1
      );
    }

    this.trackBusinessMetric('filter_interactions', 1, 'interactions');
  }

  /**
   * Track sorting interactions
   */
  onColumnSort(column: string, direction: string): void {
    this.matomoService.trackEvent('Table', 'Sort', `${column} ${direction}`, 1);
    this.trackBusinessMetric('column_sort_usage', 1, 'sorts');
  }

  /**
   * Track pagination interactions
   */
  onPageChange(pageIndex: number, pageSize: number): void {
    this.matomoService.trackEvent(
      'Table',
      'Pagination',
      `Page ${pageIndex + 1}`,
      pageSize
    );
    this.trackBusinessMetric('pagination_usage', 1, 'page_changes');
  }

  /**
   * Track transaction row clicks
   */
  onTransactionRowClick(transactionId: string, state: string): void {
    this.matomoService.trackEvent('Transaction', 'Row Click', transactionId, 1);
    this.matomoService.trackEvent('Transaction', 'State Click', state, 1);
    this.trackBusinessMetric('transaction_details_views', 1, 'views');
  }

  /**
   * Track autocomplete interactions
   */
  onAutocompleteSelection(type: string, value: any): void {
    this.matomoService.trackEvent(
      'Autocomplete',
      'Selection',
      `${type}: ${value}`,
      1
    );
    this.trackBusinessMetric('autocomplete_usage', 1, 'selections');
  }

  /**
   * Track date picker interactions
   */
  onDatePickerUsed(dateType: 'from' | 'to'): void {
    this.matomoService.trackEvent(
      'DatePicker',
      'Used',
      `Transaction Date ${dateType}`,
      1
    );
    this.trackBusinessMetric('datepicker_usage', 1, 'uses');
  }

  /**
   * Track export functionality
   */
  onExportUsed(filterType: string, value: string): void {
    this.matomoService.trackEvent(
      'Export',
      'CSV Export',
      `${filterType}: ${value}`,
      1
    );
    this.trackBusinessMetric('csv_exports', 1, 'exports');
  }

  /**
   * Track performance metrics
   */
  trackPerformanceMetric(metric: string, duration: number): void {
    this.matomoService.trackEvent(
      'Performance',
      metric,
      `${duration}ms`,
      duration
    );

    if (duration > 3000) {
      this.matomoService.trackEvent(
        'Performance',
        'Slow Operation',
        metric,
        duration
      );
    }
  }

  /**
   * Track business metrics
   */
  private trackBusinessMetric(
    metric: string,
    value: number,
    unit: string
  ): void {
    this.matomoService.trackBusinessMetric(metric, value, unit);
  }
}
