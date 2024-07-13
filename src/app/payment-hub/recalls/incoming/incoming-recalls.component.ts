/** Angular Imports */
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortable } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';

/** rxjs Imports */
import { merge } from 'rxjs';
import { tap, startWith, map, distinctUntilChanged, debounceTime } from 'rxjs/operators';

/** Custom Services */
import { convertUtcToLocal, convertMomentToDateTime } from '../../../shared/date-format/date-format.helper';
import { StateService } from '../../common/state.service';
import { CommonService } from 'app/payment-hub/common/common.service';

/** Shared Services */
import { MatPaginatorGotoComponent } from 'app/shared/mat-paginator-goto/mat-paginator-goto.component';

/** Custom Data Source */
import { RecallsDataSource } from '../dataSource/recalls.datasource';
import { transactionStatusData as transactionStatuses } from '../helper/recall.helper';
import { incomingRecallStatusData as recallStatuses } from '../helper/recall.helper';
import { recallDirectionData as recallDirections } from '../helper/recall.helper';
import { paymentSchemeData as paymentSchemes } from '../helper/recall.helper';
import { RecallsService } from '../service/recalls.service';
import { DfspEntry } from '../model/dfsp.model';
import { RetryResolveDialogComponent } from '../../common/retry-resolve-dialog/retry-resolve-dialog.component';
import { OptionData } from 'app/shared/models/general.models';

/**
 * Incoming Recalls component.
 */
@Component({
  selector: 'mifosx-incoming-recalls',
  templateUrl: './incoming-recalls.component.html',
  styleUrls: ['./incoming-recalls.component.scss']
})
export class IncomingRecallsComponent implements OnInit, AfterViewInit {

  /** Minimum transaction date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum transaction date allowed. */
  maxDate = new Date();
  filterFormGroup: FormGroup;
  focusedElement: string;
  filteredCurrencies: any;
  filteredDfspEntries: any;
  currenciesData: any;
  dfspEntriesData: DfspEntry[];
  recallStatusData = recallStatuses;
  recallDirectionData = recallDirections;
  transactionStatusData = transactionStatuses;
  businessProcessStatusData: OptionData[];
  paymentSchemeData = paymentSchemes;
  /** Columns to be displayed in transactions table. */
  displayedColumns: string[] = ['startedAt', 'completedAt', 'transactionId', 'payerPartyId', 'payeePartyId', 'payerDfspId', 'payerDfspName', 'amount', 'currency', 'status', 'recallStatus', 'recallDirection','actions'];
  /** Data source for transactions table. */
  dataSource: RecallsDataSource;
  /** Journal entries filter. */
  filterRecallsBy = [
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
      type: 'recallStatus',
      value: ''
    },
    {
      type: 'recallDirection',
      value: ''
    },
    {
      type: 'businessProcessStatus',
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
      type: 'endToEndIdentification',
      value: ''
    }
  ];

  /** Paginator for transactions table. */
  @ViewChild(MatPaginatorGotoComponent) paginator: MatPaginatorGotoComponent;
  /** Sorter for transactions table. */
  @ViewChild(MatSort) sort: MatSort;
  /** ElementRef of the filterForm. */
  @ViewChild('filterForm') filterForm: ElementRef;

  /**
   * Retrieves the offices and gl accounts data from `resolve`.
   * @param {AccountingService} accountingService Accounting Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {MatDialog} dialog Dialog reference.
   */
  constructor(private recallsService: RecallsService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private stateService: StateService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private clipboard: Clipboard) {
      this.filterFormGroup = this.formBuilder.group({
        payeePartyId: new FormControl(),
        payerPartyId: new FormControl(),
        payerDfspId: new FormControl(),
        payerDfspName: new FormControl(),
        status: new FormControl(),
        recallStatus: new FormControl(),
        recallDirection: new FormControl(),
        businessProcessStatus: new FormControl(),
        paymentScheme: new FormControl(),
        amountFrom: new FormControl(),
        amountTo: new FormControl(),
        endToEndIdentification: new FormControl(),
        currencyCode: new FormControl(),
        transactionDateFrom: new FormControl(),
        transactionDateTo: new FormControl(),
        transactionId: new FormControl(),
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
          this.stateService.clearState('incoming-recalls');
          this.filterFormGroup.controls['transactionId'].setValue(transactionId);
          this.setFilter(transactionId, 'transactionId');
        }
      });
  }

  /**
   * Sets filtered offices and gl accounts for autocomplete and journal entries table.
   */
  ngOnInit() {
    //this.setFilteredCurrencies();
    //this.setFilteredDfspEntries();
    this.getRecalls();
    this.setBusinessProcessStatusData();
    this.dataSource.loading$.subscribe(loading => {
      if (loading) {
        this.focusedElement = this.getFocusedInputFilterName();
        this.filterFormGroup.disable({emitEvent:false});
      } else {
        this.filterFormGroup.enable({emitEvent:false});
        this.setFocus(this.focusedElement);
      }
    });
  }

  setFocus(inputFilterName: string): void {
    if (inputFilterName) {
      const element = this.filterForm.nativeElement[inputFilterName];
      if (element) {
        element.focus();
        this.focusedElement = null;
      }
    }
  }

  getFocusedInputFilterName(): string | null {
    const currentFocusedElement = document.activeElement as HTMLElement;
    if (currentFocusedElement && currentFocusedElement.tagName === 'INPUT' && currentFocusedElement.closest('form') === this.filterForm.nativeElement) {
      return currentFocusedElement.getAttribute('name');
    } else {
      return null;
    }
  }

  setBusinessProcessStatusData(): void {
    this.commonService.getBusinessProcessStatusData('INCOMING', 'RECALL')
      .subscribe(response => {
        this.businessProcessStatusData = response.map(option => ({
          option: option,
          value: option,
          css: ''
        }))
      });
  }

  ngAfterViewInit() {
    const storedState = this.stateService.getState('incoming-recalls');
    if (storedState) {
      this.filterFormGroup.patchValue(storedState.filterForm);
      this.filterRecallsBy = storedState.filterBy;
      if (storedState.sort.active) {
        this.sort.sort(({ id: storedState.sort.active, start: storedState.sort.direction}) as MatSortable);
      }
      this.paginator.pageIndex = storedState.paginator.pageIndex;
      this.paginator.pageSize = storedState.paginator.pageSize;
    }
    this.controlChange();
  }

  /**
   * Subscribes to all search filters:
   * Office Name, GL Account, Transaction ID, Transaction Date From, Transaction Date To,
   * sort change and page change.
   */
  controlChange() {
    this.filterFormGroup.controls['payeePartyId'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'payeePartyId');
        })
      )
      .subscribe();

    this.filterFormGroup.controls['payerPartyId'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'payerPartyId');
        })
      )
      .subscribe();

    this.filterFormGroup.controls['payerDfspId'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'payerDfspId');
        })
      )
      .subscribe();

    this.filterFormGroup.controls['payerDfspName'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          const elements = this.dfspEntriesData.filter((option) => option.name === filterValue.name);
          if (elements.length === 1) {
            this.filterFormGroup.controls['payerDfspId'].setValue(elements[0].id);
            filterValue = elements[0].name;
          }
        })
      )
      .subscribe();

    this.filterFormGroup.controls['transactionId'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'transactionId');
        })
      )
      .subscribe();

    this.filterFormGroup.controls['status'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'status');
        })
      )
      .subscribe();

    this.filterFormGroup.controls['recallStatus'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'recallStatus');
        })
      )
      .subscribe();

    this.filterFormGroup.controls['recallDirection'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'recallDirection');
        })
      )
      .subscribe();

    this.filterFormGroup.controls['businessProcessStatus'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'businessProcessStatus');
        })
      )
      .subscribe();

    this.filterFormGroup.controls['paymentScheme'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'paymentScheme');
        })
      )
      .subscribe();

    this.filterFormGroup.controls['amountFrom'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'amountFrom');
        })
      )
      .subscribe();

    this.filterFormGroup.controls['amountTo'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'amountTo');
        })
      )
      .subscribe();

    this.filterFormGroup.controls['currencyCode'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          filterValue = filterValue.AlphabeticCode;
          this.applyFilter(filterValue, 'currency');
        })
      )
      .subscribe();

    this.filterFormGroup.controls['transactionDateFrom'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(convertMomentToDateTime(filterValue), 'startFrom');
        })
      )
      .subscribe();

    this.filterFormGroup.controls['transactionDateTo'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(convertMomentToDateTime(filterValue), 'startTo');
        })
      )
      .subscribe();

    this.filterFormGroup.controls['endToEndIdentification'].valueChanges
        .pipe(
            debounceTime(1000),
            distinctUntilChanged(),
            tap((filterValue) => {
              this.applyFilter(filterValue, 'endToEndIdentification');
            })
        )
        .subscribe();

    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.paginator.goTo = 1;
    });

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadRecallsPage();
          this.stateService.setState('incoming-recalls', this.filterFormGroup, this.filterRecallsBy, this.sort, this.paginator);
        })
        )
      .subscribe();

    this.loadRecallsPage();
  }

  /**
   * Loads a page of recalls.
   */
  loadRecallsPage() {
    if (!this.sort.direction) {
      delete this.sort.active;
    }
    this.dataSource.getRecalls(this.filterRecallsBy, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
  }

  /**
   * Filters data in transactions table based on passed value and poperty.
   * @param {string} filterValue Value to filter data.
   * @param {string} property Property to filter data by.
   */
  applyFilter(filterValue: string, property: string) {
    this.paginator.pageIndex = 0;
    const findIndex = this.filterRecallsBy.findIndex(filter => filter.type === property);
    this.filterRecallsBy[findIndex].value = filterValue;
    this.stateService.setState('incoming-recalls', this.filterFormGroup, this.filterRecallsBy, this.sort, this.paginator);
    this.loadRecallsPage();
  }

  setFilter(filterValue: string, property: string) {
    const findIndex = this.filterRecallsBy.findIndex(filter => filter.type === property);
    this.filterRecallsBy[findIndex].value = filterValue;
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

  formatDate(date: string): string {
    return convertUtcToLocal(date);
  }

  /**
   * Sets filtered gl accounts for autocomplete.
   */
  setFilteredCurrencies() {
    this.filteredCurrencies = this.filterFormGroup.controls['currencyCode'].valueChanges
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
    this.filteredDfspEntries = this.filterFormGroup.controls['payerDfspName'].valueChanges
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
   * Initializes the data source for transactions table and loads the first page.
   */
  getRecalls() {
    this.dataSource = new RecallsDataSource(this.recallsService);
    const storedState = this.stateService.getState('incoming-recalls');
    if (storedState) {
      this.dataSource.getRecalls(storedState.filterBy, storedState.sort.active, storedState.sort.direction, storedState.paginator.pageIndex, storedState.paginator.pageSize);
    } else {
      this.dataSource.getRecalls(this.filterRecallsBy, '', '', 0, 10);
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

  navigateToTransactionsPage(transactionId: string) {
    this.router.navigate(['/paymenthubee/incomingtransactions'], { queryParams: { transactionId: transactionId } });
  }

  resetFilters() {
    this.filterFormGroup.reset({}, { emitEvent: false });
    this.paginator.pageIndex = 0;
    this.paginator.goTo = 1;
    this.filterRecallsBy.forEach(filter => {
      if (filter.type !== 'direction') {
        filter.value = '';
      }
    });
    this.stateService.clearState('incoming-recalls');
    this.controlChange();
  }

  onCopy(event: ClipboardEvent) {
    event.preventDefault();
    const inputElement = event.target as HTMLInputElement;
    const text = inputElement.value.replace(/\s+/g, '');
    this.clipboard.copy(text);
  }

}
