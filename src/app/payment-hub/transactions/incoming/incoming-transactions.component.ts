/** Angular Imports */
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/** rxjs Imports */
import { merge } from 'rxjs';
import { tap, startWith, map, distinctUntilChanged, debounceTime } from 'rxjs/operators';

/** Custom Services */

/** Custom Data Source */
import { TransactionsDataSource } from '../dataSource/transactions.datasource';
import { formatDateForDisplay, convertMomentToDate } from '../../../shared/date-format/date-format.helper';
import { transactionStatusData as statuses } from '../helper/transaction.helper';
import { incomingPaymentStatusData as paymentStatuses } from '../helper/transaction.helper';
import { paymentSchemeData as paymentSchemes } from '../helper/transaction.helper';
import { TransactionsService } from '../service/transactions.service';
import { DfspEntry } from '../model/dfsp.model';
import { RetryResolveDialogComponent } from '../../common/retry-resolve-dialog/retry-resolve-dialog.component';

/**
 * Transactions component.
 */
@Component({
  selector: 'mifosx-incoming-transactions',
  templateUrl: './incoming-transactions.component.html',
  styleUrls: ['./incoming-transactions.component.scss']
})
export class IncomingTransactionsComponent implements OnInit, AfterViewInit {

  /** Minimum transaction date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum transaction date allowed. */
  maxDate = new Date();
  filterForm: FormGroup;
  filteredCurrencies: any;
  filteredDfspEntries: any;
  currenciesData: any;
  dfspEntriesData: DfspEntry[];
  transactionStatusData = statuses;
  paymentStatusData = paymentStatuses;
  paymentSchemeData = paymentSchemes;
  /** Columns to be displayed in transactions table. */
  displayedColumns: string[] = ['startedAt', 'completedAt', 'acceptanceDate', 'transactionId', 'payerPartyId', 'payeePartyId', 'payerDfspId', 'payerDfspName', 'amount', 'currency', 'status', 'actions'];
  /** Data source for transactions table. */
  dataSource: TransactionsDataSource;
  /** Journal entries filter. */
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
      type: 'paymentStatus',
      value: ''
    },
    {
      type: 'paymentScheme',
      value: ''
    },
    {
      type: 'amountFrom',
      value: ''
    },
    {
      type: 'amountTo',
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
    },
    {
      type: 'acceptanceDateFrom',
      value: ''
    },
    {
      type: 'acceptanceDateTo',
      value: ''
    },
    {
      type: 'endToEndIdentification',
      value: ''
    }
  ];

  /** Paginator for transactions table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for transactions table. */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Retrieves the offices and gl accounts data from `resolve`.
   * @param {AccountingService} accountingService Accounting Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {MatDialog} dialog Dialog reference.
   */
  constructor(private transactionsService: TransactionsService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder) {
      this.filterForm = this.formBuilder.group({
        payeePartyId: new FormControl(),
        payerPartyId: new FormControl(),
        payerDfspId: new FormControl(),
        payerDfspName: new FormControl(),
        status: new FormControl(),
        paymentStatus: new FormControl(),
        paymentScheme: new FormControl(),
        amountFrom: new FormControl(),
        amountTo: new FormControl(),
        endToEndIdentification: new FormControl(),
        currencyCode: new FormControl(),
        transactionDateFrom: new FormControl(),
        transactionDateTo: new FormControl(),
        acceptanceDateFrom: new FormControl(),
        acceptanceDateTo: new FormControl(),
        transactionId: new FormControl()
      });
      this.route.data.subscribe((data: {
        currencies: any
        dfspEntries: DfspEntry[]
      }) => {
        this.currenciesData = data.currencies;
        this.dfspEntriesData = data.dfspEntries;
      });
      this.route.queryParams.subscribe(params => {
        const transactionId = params['transactionId'];
        if (transactionId) {
          this.filterForm.controls['transactionId'].setValue(transactionId);
          this.setFilter(transactionId, 'transactionId');
        }
      });
  }

  /**
   * Sets filtered offices and gl accounts for autocomplete and journal entries table.
   */
  ngOnInit() {
    this.setFilteredCurrencies();
    this.setFilteredDfspEntries();
    this.getTransactions();
  }

  ngAfterViewInit() {
    this.controlChange();
  }

  /**
   * Subscribes to all search filters:
   * Office Name, GL Account, Transaction ID, Transaction Date From, Transaction Date To,
   * sort change and page change.
   */
  controlChange() {
    this.filterForm.controls['payeePartyId'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'payeePartyId');
        })
      )
      .subscribe();

    this.filterForm.controls['payerPartyId'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'payerPartyId');
        })
      )
      .subscribe();

    this.filterForm.controls['payerDfspId'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'payerDfspId');
        })
      )
      .subscribe();

    this.filterForm.controls['payerDfspName'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          const elements = this.dfspEntriesData.filter((option) => option.name === filterValue.name);
          if (elements.length === 1) {
            this.filterForm.controls['payerDfspId'].setValue(elements[0].id);
            filterValue = elements[0].name;
          }
        })
      )
      .subscribe();

    this.filterForm.controls['transactionId'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'transactionId');
        })
      )
      .subscribe();

    this.filterForm.controls['status'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'status');
        })
      )
      .subscribe();

    this.filterForm.controls['paymentStatus'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'paymentStatus');
        })
      )
      .subscribe();

    this.filterForm.controls['paymentScheme'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'paymentScheme');
        })
      )
      .subscribe();

    this.filterForm.controls['amountFrom'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'amountFrom');
        })
      )
      .subscribe();

    this.filterForm.controls['amountTo'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'amountTo');
        })
      )
      .subscribe();

    this.filterForm.controls['currencyCode'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          filterValue = filterValue.AlphabeticCode;
          this.applyFilter(filterValue, 'currency');
        })
      )
      .subscribe();

    this.filterForm.controls['transactionDateFrom'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(convertMomentToDate(filterValue), 'startFrom');
        })
      )
      .subscribe();

    this.filterForm.controls['transactionDateTo'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(convertMomentToDate(filterValue), 'startTo');
        })
      )
      .subscribe();

    this.filterForm.controls['acceptanceDateFrom'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(convertMomentToDate(filterValue), 'acceptanceDateFrom');
        })
      )
      .subscribe();

    this.filterForm.controls['acceptanceDateTo'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(convertMomentToDate(filterValue), 'acceptanceDateTo');
        })
      )
      .subscribe();

    this.filterForm.controls['endToEndIdentification'].valueChanges
        .pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap((filterValue) => {
              this.applyFilter(filterValue, 'endToEndIdentification');
            })
        )
        .subscribe();

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadTransactionsPage())
      )
      .subscribe();

    this.loadTransactionsPage();
  }

  /**
   * Loads a page of transactions.
   */
  loadTransactionsPage() {
    if (!this.sort.direction) {
      delete this.sort.active;
    }
    this.dataSource.getTransactions(this.filterTransactionsBy, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
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

  setFilter(filterValue: string, property: string) {
    const findIndex = this.filterTransactionsBy.findIndex(filter => filter.type === property);
    this.filterTransactionsBy[findIndex].value = filterValue;
  }

  /**
   * Displays office name in form control input.
   * @param {any} office Office data.
   * @returns {string} Office name if valid otherwise undefined.
   */
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

  shortenValue(value: any) {
    return value && value.length > 15 ? value.slice(0, 13) + '...' : value;
  }

  displayStatus(status?: any): string | undefined {
    const elements = this.transactionStatusData.filter((option) => option.value === status);
    return elements.length > 0 ? elements[0].option : undefined;
  }

  displayCSS(status?: any): string | undefined {
    const elements = this.transactionStatusData.filter((option) => option.value === status);
    return elements.length > 0 ? elements[0].css : undefined;
  }

  formatDate(date: string): string{
    return formatDateForDisplay(date);
  }

  /**
   * Sets filtered gl accounts for autocomplete.
   */
  setFilteredCurrencies() {
    this.filteredCurrencies = this.filterForm.controls['currencyCode'].valueChanges
      .pipe(
        startWith(''),
        map((currency: any) => typeof currency === 'string' ? currency : currency.Currency + ' (' + currency.AlphabeticCode + ')'),
        map((currency: string) => currency ? this.filterCurrencyAutocompleteData(currency) : this.currenciesData)
      );
  }

  /**
   * Sets filtered gl accounts for autocomplete.
   */
  setFilteredDfspEntries() {
    this.filteredDfspEntries = this.filterForm.controls['payerDfspName'].valueChanges
      .pipe(
        startWith(''),
        map((entry: any) => typeof entry === 'string' ? entry : entry.name + ' (' + entry.id + ')'),
        map((entry: string) => entry ? this.filterDfspAutocompleteData(entry) : this.dfspEntriesData)
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

  private filterDfspAutocompleteData(entry: string): any {
    return this.dfspEntriesData.filter((option: any) => (option.name + ' (' + option.id + ')').toLowerCase().includes(entry.toLowerCase()));
  }

  /**
   * Initializes the data source for journal entries table and loads the first page.
   */
  getTransactions() {
    this.dataSource = new TransactionsDataSource(this.transactionsService);
    if (this.sort && this.paginator) {
      this.dataSource.getTransactions(this.filterTransactionsBy, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
    } else {
      this.dataSource.getTransactions(this.filterTransactionsBy, '', '', 0, 10);
    }
  }

  openRetryResolveDialog(workflowInstanceKey: any, action: string) {
    const retryResolveDialogRef = this.dialog.open(RetryResolveDialogComponent, {
      data: {
        action: action,
        workflowInstanceKey: workflowInstanceKey
      },
    });
  }

  navigateToRecallsPage(transactionId: string) {
    this.router.navigate(['/paymenthubee/incomingrecalls'], { queryParams: { transactionId: transactionId } });
  }

  resetFilters() {
    this.filterForm.reset({}, { emitEvent: false });
    this.paginator.pageIndex = 0;
    this.filterTransactionsBy.forEach(filter => {
      if (filter.type !== 'direction') {
        filter.value = '';
      }
    });
    this.controlChange();
  }
  
}
