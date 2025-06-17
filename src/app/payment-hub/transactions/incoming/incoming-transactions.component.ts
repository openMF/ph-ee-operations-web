/** Angular Imports */
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

/** rxjs Imports */
import { merge } from 'rxjs';
import {
  tap,
  startWith,
  map,
  distinctUntilChanged,
  debounceTime,
} from 'rxjs/operators';

/** Custom Services */
import { MatomoService } from 'app/core/analytics/matomo.service';

/** Custom Data Source */
import { TransactionsDataSource } from '../dataSource/transactions.datasource';
import { formatDate, formatUTCDate } from '../helper/date-format.helper';
import { transactionStatusData as statuses } from '../helper/transaction.helper';
import { TransactionsService } from '../service/transactions.service';
import { DfspEntry } from '../model/dfsp.model';
import { RetryResolveDialogComponent } from '../retry-resolve-dialog/retry-resolve-dialog.component';
import { amsShortCodes } from 'app/payment-hub/request-to-pay/helper/ams-short-codes';

/**
 * Transactions component.
 */
@Component({
  selector: 'mifosx-incoming-transactions',
  templateUrl: './incoming-transactions.component.html',
  styleUrls: ['./incoming-transactions.component.scss'],
})
export class IncomingTransactionsComponent implements OnInit, AfterViewInit {
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
  amsCodes = amsShortCodes('PAYBILL');
  /** Transaction date from form control. */
  transactionDateFrom = new FormControl();
  /** Transaction date to form control. */
  transactionDateTo = new FormControl();
  externalId = new FormControl();
  /** Transaction ID form control. */
  transactionId = new FormControl();
  /** Columns to be displayed in transactions table. */
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
    'status',
    'actions',
  ];
  /** Data source for transactions table. */
  dataSource: TransactionsDataSource;
  /** Journal entries filter. */
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
      type: 'clientCorrelationId',
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
      type: 'status',
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
      type: 'payerDfspId',
      value: '',
    },
  ];
  dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

  /** Paginator for transactions table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for transactions table. */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Constructor - initializes services and sets up component data.
   * @param {TransactionsService} transactionsService Transactions Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {MatDialog} dialog Dialog reference.
   * @param {MatomoService} matomoService Matomo Analytics Service.
   */
  constructor(
    private transactionsService: TransactionsService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private matomoService: MatomoService
  ) {
    this.route.data.subscribe(
      (data: { currencies: any; dfspEntries: DfspEntry[] }) => {
        this.currenciesData = data.currencies;
        this.dfspEntriesData = data.dfspEntries;
      }
    );
  }

  /**
   * Sets filtered offices and gl accounts for autocomplete and journal entries table.
   */
  ngOnInit() {
    // Track page view
    this.matomoService.trackPageView('Incoming Transactions');
    this.matomoService.trackEvent(
      'Transaction Management',
      'View Incoming Transactions',
      'Page Load'
    );

    // Set custom dimension for transaction direction
    this.matomoService.setCustomDimension(2, 'INCOMING');

    this.setFilteredCurrencies();
    this.setFilteredDfspEntries();
    this.getTransactions();
  }

  /**
   * Subscribes to all search filters:
   * Office Name, GL Account, Transaction ID, Transaction Date From, Transaction Date To,
   * sort change and page change.
   */
  ngAfterViewInit() {
    this.payeePartyId.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          if (filterValue.length === 0 || filterValue.length > 3) {
            this.applyFilter(filterValue, 'payeePartyId');
            // Track filter usage
            this.matomoService.trackEvent(
              'Transaction Management',
              'Filter Applied',
              'Payee Party ID',
              filterValue.length
            );
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
            // Track filter usage
            this.matomoService.trackEvent(
              'Transaction Management',
              'Filter Applied',
              'Payer Party ID',
              filterValue.length
            );
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
          // Track filter usage
          this.matomoService.trackEvent(
            'Transaction Management',
            'Filter Applied',
            'AMS Business Short Code',
            1
          );
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
          this.applyFilter(filterValue, 'transactionId');
          // Track filter usage
          this.matomoService.trackEvent(
            'Transaction Management',
            'Filter Applied',
            'Transaction ID',
            filterValue.length
          );
        })
      )
      .subscribe();

    this.status.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'status');
          // Track filter usage
          this.matomoService.trackEvent(
            'Transaction Management',
            'Filter Applied',
            'Status',
            1
          );
          if (filterValue) {
            this.matomoService.setCustomDimension(3, filterValue);
          }
        })
      )
      .subscribe();

    this.amount.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'amount');
          // Track filter usage
          this.matomoService.trackEvent(
            'Transaction Management',
            'Filter Applied',
            'Amount',
            filterValue ? 1 : 0
          );
          if (filterValue) {
            this.matomoService.trackEvent(
              'Transaction Management',
              'Amount Range Filter',
              'Value',
              parseFloat(filterValue) || 0
            );
          }
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
          // Track filter usage
          this.matomoService.trackEvent(
            'Transaction Management',
            'Filter Applied',
            'Currency',
            1
          );
          if (filterValue) {
            this.matomoService.setCustomDimension(4, filterValue);
          }
        })
      )
      .subscribe();

    this.transactionDateFrom.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue: moment.Moment) => {
          this.applyFilter(
            filterValue.format(this.dateTimeFormat),
            'startFrom'
          );
          // Track filter usage
          this.matomoService.trackEvent(
            'Transaction Management',
            'Filter Applied',
            'Date From',
            1
          );
          this.matomoService.trackEvent(
            'Transaction Management',
            'Date Range Filter',
            'From Date Set'
          );
        })
      )
      .subscribe();

    this.transactionDateTo.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue: moment.Moment) => {
          this.applyFilter(filterValue.format(this.dateTimeFormat), 'startTo');
          // Track filter usage
          this.matomoService.trackEvent(
            'Transaction Management',
            'Filter Applied',
            'Date To',
            1
          );
          this.matomoService.trackEvent(
            'Transaction Management',
            'Date Range Filter',
            'To Date Set'
          );
        })
      )
      .subscribe();

    this.externalId.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          // check if length is reset or above 3
          if (filterValue.length === 0 || filterValue.length > 3) {
            this.applyFilter(filterValue, 'clientCorrelationId');
            // Track filter usage
            this.matomoService.trackEvent(
              'Transaction Management',
              'Filter Applied',
              'External ID',
              filterValue.length
            );
          }
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      // Track sorting usage
      this.matomoService.trackEvent(
        'Transaction Management',
        'Table Sorted',
        `${this.sort.active} ${this.sort.direction}`
      );
    });

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadTransactionsPage();
          // Track pagination
          this.matomoService.trackEvent(
            'Transaction Management',
            'Page Changed',
            `Page ${this.paginator.pageIndex + 1}`,
            this.paginator.pageSize
          );
        })
      )
      .subscribe();
  }

  /**
   * Loads a page of transactions.
   */
  loadTransactionsPage() {
    const startTime = performance.now();

    if (!this.sort.direction) {
      delete this.sort.active;
    }

    this.dataSource.getTransactions(
      this.filterTransactionsBy,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );

    // Track performance
    const loadTime = performance.now() - startTime;
    this.matomoService.trackEvent(
      'Performance',
      'Transaction Load Time',
      'Incoming Transactions',
      Math.round(loadTime)
    );

    // Track business metrics
    const activeFilters = this.filterTransactionsBy.filter(
      (filter) => filter.value && filter.value.length > 0
    ).length;
    this.matomoService.trackEvent(
      'Transaction Management',
      'Transactions Loaded',
      'Active Filters',
      activeFilters
    );
  }

  convertTimestampToUTCDate(timestamp: any) {
    if (!timestamp) {
      return undefined;
    }
    return formatUTCDate(new Date(timestamp));
  }

  convertTimestampToDate(timestamp: any) {
    if (!timestamp) {
      return undefined;
    }
    return formatDate(new Date(timestamp));
  }

  /**
   * Filters data in transactions table based on passed value and poperty.
   * @param {string} filterValue Value to filter data.
   * @param {string} property Property to filter data by.
   */
  applyFilter(filterValue: string, property: string) {
    // Track filter usage analytics
    this.matomoService.trackEvent(
      'Transaction Management',
      'Filter Applied',
      `${property}: ${filterValue ? 'Applied' : 'Cleared'}`
    );

    // Track specific filter metrics
    if (filterValue) {
      this.matomoService.trackEvent(
        'Search and Filter',
        'Filter Used',
        property,
        1
      );
      this.matomoService.setCustomDimension(3, property); // Track most used filter type
    }

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
   * Displays office name in form control input.
   * @param {any} office Office data.
   * @returns {string} Office name if valid otherwise undefined.
   */
  displayDfspName(entry?: any): string | undefined {
    return entry ? entry.name : undefined;
  }

  shortenValue(value: any) {
    return value && value.length > 15 ? value.slice(0, 13) + '...' : value;
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

  formatDate(date: string) {
    if (!date) {
      return undefined;
    }
    date = date.toString();
    date = date.replace('+0000', '');
    date = date.replace('T', ' ');
    date = date.replace('.000', '');
    return date;
  }

  formatEndDate(date: string) {
    if (!date) {
      return undefined;
    }
    date = this.formatDate(date);
    return date.split(' ')[1];
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
   * Sets filtered gl accounts for autocomplete.
   */
  setFilteredDfspEntries() {
    this.filteredDfspEntries = this.payerDfspName.valueChanges.pipe(
      startWith(''),
      map((entry: any) =>
        typeof entry === 'string' ? entry : entry.name + ' (' + entry.id + ')'
      ),
      map((entry: string) =>
        entry ? this.filterDfspAutocompleteData(entry) : this.dfspEntriesData
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

  private filterDfspAutocompleteData(entry: string): any {
    return this.dfspEntriesData.filter((option: any) =>
      (option.name + ' (' + option.id + ')')
        .toLowerCase()
        .includes(entry.toLowerCase())
    );
  }

  /**
   * Initializes the data source for journal entries table and loads the first page.
   */
  getTransactions() {
    const startTime = performance.now();

    this.dataSource = new TransactionsDataSource(this.transactionsService);
    if (this.sort && this.paginator) {
      this.dataSource.getTransactions(
        this.filterTransactionsBy,
        this.sort.active,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize
      );
    } else {
      this.dataSource.getTransactions(this.filterTransactionsBy, '', '', 0, 10);
    }

    // Track initial load performance
    const loadTime = performance.now() - startTime;
    this.matomoService.trackEvent(
      'Performance',
      'Initial Transaction Load',
      'Incoming Transactions',
      Math.round(loadTime)
    );
  }

  /**
   * Opens retry/resolve dialog for transaction actions.
   * @param {any} workflowInstanceKey The workflow instance key.
   * @param {string} action The action to perform (retry or resolve).
   */
  openRetryResolveDialog(workflowInstanceKey: any, action: string) {
    // Track user action
    this.matomoService.trackEvent(
      'Transaction Management',
      'Action Button Clicked',
      action,
      1
    );
    this.matomoService.trackEvent(
      'Transaction Management',
      `Transaction ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      'Dialog Opened'
    );

    const retryResolveDialogRef = this.dialog.open(
      RetryResolveDialogComponent,
      {
        data: {
          action: action,
          workflowInstanceKey: workflowInstanceKey,
        },
      }
    );

    // Track dialog result
    retryResolveDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.matomoService.trackEvent(
          'Transaction Management',
          `Transaction ${action.charAt(0).toUpperCase() + action.slice(1)}`,
          'Action Confirmed'
        );
      } else {
        this.matomoService.trackEvent(
          'Transaction Management',
          `Transaction ${action.charAt(0).toUpperCase() + action.slice(1)}`,
          'Action Cancelled'
        );
      }
    });
  }
}
