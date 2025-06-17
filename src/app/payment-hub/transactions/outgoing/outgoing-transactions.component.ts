/** Angular Imports */
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

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
import { MatomoService } from '../../../core/analytics/matomo.service';

/** Custom Data Source */
import { TransactionsDataSource } from '../dataSource/transactions.datasource';
import { formatDate, formatUTCDate } from '../helper/date-format.helper';
import { TransactionsService } from '../service/transactions.service';
import { PaymentHubComponent } from 'app/payment-hub/paymenthub.component';
import { DfspEntry } from '../model/dfsp.model';
import { transactionStatusData as statuses } from '../helper/transaction.helper';
import { RetryResolveDialogComponent } from '../retry-resolve-dialog/retry-resolve-dialog.component';

/**
 * Transactions component.
 */
@Component({
  selector: 'mifosx-outgoing-transactions',
  templateUrl: './outgoing-transactions.component.html',
  styleUrls: ['./outgoing-transactions.component.scss'],
})
export class OutgoingTransactionsComponent implements OnInit, AfterViewInit {
  /** Minimum transaction date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum transaction date allowed. */
  maxDate = new Date();
  payeePartyId = new FormControl();
  payerPartyId = new FormControl();
  payeeDfspId = new FormControl();
  payeeDfspName = new FormControl();
  status = new FormControl();
  amount = new FormControl();
  currencyCode = new FormControl();
  filteredCurrencies: any;
  filteredDfspEntries: any;
  currenciesData: any;
  dfspEntriesData: DfspEntry[];
  transactionStatusData = statuses;
  /** Transaction date from form control. */
  transactionDateFrom = new FormControl();
  /** Transaction date to form control. */
  transactionDateTo = new FormControl();
  /** Transaction ID form control. */
  transactionId = new FormControl();
  /** Columns to be displayed in transactions table. */
  displayedColumns: string[] = [
    'startedAt',
    'completedAt',
    'transactionId',
    'payerPartyId',
    'payeePartyId',
    'payeeDfspId',
    'payeeDfspName',
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
      type: 'payeeDfspId',
      value: '',
    },
    {
      type: 'direction',
      value: 'OUTGOING',
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
  ];
  dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

  /** Paginator for transactions table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for transactions table. */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Retrieves the offices and gl accounts data from `resolve`.
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
    this.trackPageView();
    this.setupAnalytics();
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

    this.payeeDfspId.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'payeeDfspId');
        })
      )
      .subscribe();

    this.payeeDfspName.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          const elements = this.dfspEntriesData.filter(
            (option) => option.name === filterValue.name
          );
          if (elements.length === 1) {
            this.payeeDfspId.setValue(elements[0].id);
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
        tap((filterValue: moment.Moment) => {
          this.applyFilter(
            filterValue.format(this.dateTimeFormat),
            'startFrom'
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
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadTransactionsPage()))
      .subscribe();
  }

  /**
   * Loads a page of transactions.
   */
  loadTransactionsPage() {
    // Track sorting if applied
    if (this.sort.direction && this.sort.active) {
      this.onColumnSort(this.sort.active, this.sort.direction);
    }

    // Track pagination if paginator exists
    if (this.paginator) {
      this.onPageChange(this.paginator.pageIndex, this.paginator.pageSize);
    }

    // Track performance of transaction loading
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

    // Track loading performance
    setTimeout(() => {
      const loadTime = performance.now() - startTime;
      try {
        this.matomoService.trackPerformance(
          'Outgoing Transactions Load',
          loadTime
        );
      } catch (error) {
        console.warn('Performance tracking failed:', error);
      }
    }, 100);
  }

  /**
   * Filters data in transactions table based on passed value and poperty.
   * @param {string} filterValue Value to filter data.
   * @param {string} property Property to filter data by.
   */
  applyFilter(filterValue: string, property: string) {
    // Track filter usage for analytics
    this.onFilterUsed(property, filterValue);

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

  convertTimestampToDate(timestamp: any) {
    if (!timestamp) {
      return undefined;
    }
    return formatDate(new Date(timestamp));
  }

  convertTimestampToUTCDate(timestamp: any) {
    if (!timestamp) {
      return undefined;
    }
    return formatUTCDate(new Date(timestamp));
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
    this.filteredDfspEntries = this.payeeDfspName.valueChanges.pipe(
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
  }

  openRetryResolveDialog(workflowInstanceKey: any, action: string) {
    // Track retry/resolve dialog interaction
    this.trackRetryResolveAction(action, workflowInstanceKey);

    const retryResolveDialogRef = this.dialog.open(
      RetryResolveDialogComponent,
      {
        data: {
          action: action,
          workflowInstanceKey: workflowInstanceKey,
        },
      }
    );
  }

  // =========================
  // MATOMO ANALYTICS METHODS
  // =========================

  /**
   * Track page view for Outgoing Transactions
   */
  private trackPageView(): void {
    try {
      this.matomoService.trackPageView('Outgoing Transactions Search');

      // Set custom dimensions for outgoing transactions context
      this.matomoService.setCustomDimension(1, 'Payment Hub');
      this.matomoService.setCustomDimension(2, 'Outgoing Transactions');
      this.matomoService.setCustomDimension(3, 'Search Interface');

      // Track initial load performance
      const startTime = performance.now();
      setTimeout(() => {
        const loadTime = performance.now() - startTime;
        this.matomoService.trackPerformance(
          'Outgoing Transactions Page Load',
          loadTime
        );
      }, 100);
    } catch (error) {
      console.warn('Analytics page view tracking failed:', error);
    }
  }

  /**
   * Setup analytics configuration for Outgoing Transactions
   */
  private setupAnalytics(): void {
    try {
      // Track that user accessed the outgoing transactions page
      this.matomoService.trackEvent(
        'Page View',
        'Outgoing Transactions',
        'Search Interface Access'
      );

      // Track business metric - Outgoing Transactions page access
      this.matomoService.trackBusinessMetric(
        'outgoing_transactions_access',
        1,
        'page_views'
      );
    } catch (error) {
      console.warn('Analytics setup failed:', error);
    }
  }

  /**
   * Track filter usage for analytics
   * @param filterType The type of filter being used
   * @param filterValue The value being filtered
   */
  onFilterUsed(filterType: string, filterValue: any): void {
    try {
      // Track filter usage
      this.matomoService.trackEvent(
        'Filter Usage',
        'Outgoing Transactions Filter',
        filterType,
        filterValue ? 1 : 0
      );

      // Track filter type popularity
      this.matomoService.trackBusinessMetric(
        `${filterType}_filter_usage`,
        1,
        'filters'
      );

      // Set custom dimension for current filter context
      this.matomoService.setCustomDimension(4, filterType);
    } catch (error) {
      console.warn('Filter tracking failed:', error);
    }
  }

  /**
   * Track sorting actions
   * @param column The column being sorted
   * @param direction The sort direction
   */
  onColumnSort(column: string, direction: string): void {
    try {
      this.matomoService.trackEvent(
        'Table Interaction',
        'Column Sort',
        `${column} - ${direction}`
      );

      this.matomoService.trackBusinessMetric(
        `${column}_sort_usage`,
        1,
        'sorts'
      );
    } catch (error) {
      console.warn('Sort tracking failed:', error);
    }
  }

  /**
   * Track pagination actions
   * @param pageIndex Current page index
   * @param pageSize Current page size
   */
  onPageChange(pageIndex: number, pageSize: number): void {
    try {
      this.matomoService.trackEvent(
        'Pagination',
        'Page Change',
        `Page ${pageIndex + 1} (Size: ${pageSize})`
      );

      this.matomoService.trackBusinessMetric(
        'pagination_usage',
        1,
        'page_changes'
      );
    } catch (error) {
      console.warn('Pagination tracking failed:', error);
    }
  }

  /**
   * Track retry/resolve dialog actions
   * @param action The action type (retry/resolve)
   * @param workflowInstanceKey The workflow instance key
   */
  private trackRetryResolveAction(
    action: string,
    workflowInstanceKey: string
  ): void {
    try {
      this.matomoService.trackEvent(
        'Transaction Action',
        'Retry Resolve Dialog',
        `${action} - ${workflowInstanceKey}`
      );

      this.matomoService.trackBusinessMetric(`${action}_actions`, 1, 'actions');
    } catch (error) {
      console.warn('Retry/Resolve action tracking failed:', error);
    }
  }

  /**
   * Track transaction row navigation
   * @param transactionId The transaction ID being viewed
   */
  onTransactionRowClick(transactionId: string): void {
    try {
      this.matomoService.trackEvent(
        'Navigation',
        'Transaction Details',
        'View Transaction Details'
      );

      this.matomoService.trackBusinessMetric(
        'transaction_detail_views',
        1,
        'views'
      );

      // Set custom dimension for transaction viewing context
      this.matomoService.setCustomDimension(5, 'Transaction Details');
    } catch (error) {
      console.warn('Transaction navigation tracking failed:', error);
    }
  }

  /**
   * Track autocomplete option selection
   * @param optionType The type of autocomplete (currency, dfsp)
   * @param selectedValue The selected value
   */
  onAutocompleteSelection(optionType: string, selectedValue: any): void {
    try {
      this.matomoService.trackEvent(
        'Autocomplete Usage',
        'Option Selection',
        `${optionType} - ${selectedValue}`
      );

      this.matomoService.trackBusinessMetric(
        `${optionType}_autocomplete_usage`,
        1,
        'selections'
      );
    } catch (error) {
      console.warn('Autocomplete tracking failed:', error);
    }
  }
}
