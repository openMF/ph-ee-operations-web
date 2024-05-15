/** Angular Imports */
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSort, MatSortable } from "@angular/material/sort";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";

/** rxjs Imports */
import { merge } from 'rxjs';
import { tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

/** Custom Services */
import { RequestToPayService } from "../service/request-to-pay.service";
import { StateService } from '../../common/state.service';
import { CommonService } from "app/payment-hub/common/common.service";

/** Shared Services */
import { MatPaginatorGotoComponent } from 'app/shared/mat-paginator-goto/mat-paginator-goto.component';

//import { TransactionDetails } from '../../transacions/model/transaction-details.model';
import { convertUtcToLocal, convertMomentToDate } from '../../../shared/date-format/date-format.helper';

/** Custom Data Source */
import { transactionStatusData as statuses } from "../helper/incoming-request.helper";

import { DfspEntry } from "../model/dfsp.model";
import { RequestToPayDataSource } from "../dataSource/requestToPay.datasource";
import { OptionData } from "app/shared/models/general.models";

@Component({
  selector: "mifosx-incoming-request-to-pay",
  templateUrl: "./incoming-request-to-pay.component.html",
  styleUrls: ["./incoming-request-to-pay.component.scss"],
})
export class IncomingRequestToPayComponent implements OnInit, AfterViewInit {
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
  transactionStatusData = statuses;
  businessProcessStatusData: OptionData[];
  csvExport: [];
  csvName: string;
  lengthElement: number;
  /** Columns to be displayed in request to pay table. */
  displayedColumns: string[] = ['startedAt', 'completedAt', 'transactionId', 'payerPartyId', 'payeePartyId', 'payerDfspId', 'payerDfspName', 'amount', 'currency', 'status', 'actions'];
  /** Data source for request to pay table. */
  dataSource: RequestToPayDataSource;

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  filterRequestsBy = [
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
      type: "rtpDirection",
      value: "INCOMING",
    },
    {
      type: "transactionId",
      value: "",
    },
    {
      type: "status",
      value: "",
    },
    {
      type: 'businessProcessStatus',
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
  ];

  /** Paginator for requesttopay table. */
  @ViewChild(MatPaginatorGotoComponent) paginator: MatPaginatorGotoComponent;
  /** Sorter for requesttopay table. */
  @ViewChild(MatSort) sort: MatSort;
  /** ElementRef of the filterForm. */
  @ViewChild('filterForm') filterForm: ElementRef;

  constructor(
    private requestToPayService: RequestToPayService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private stateService: StateService,
    private commonService: CommonService,
    private http: HttpClient,
    private formBuilder: FormBuilder) {
      this.filterFormGroup = this.formBuilder.group({
        payeePartyId: new FormControl(),
        payerPartyId: new FormControl(),
        payerDfspId: new FormControl(),
        payerDfspName: new FormControl(),
        status: new FormControl(),
        businessProcessStatus: new FormControl(),
        amountFrom: new FormControl(),
        amountTo: new FormControl(),
        currencyCode: new FormControl(),
        transactionDateFrom: new FormControl(),
        transactionDateTo: new FormControl(),
        transactionId: new FormControl()
      });
      this.route.data.subscribe((data: {
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
    this.commonService.getBusinessProcessStatusData('INCOMING', 'REQUEST_TO_PAY')
      .subscribe(response => {
        this.businessProcessStatusData = response.map(option => ({
          option: option,
          value: option,
          css: ''
        }))
      });
  }

  ngAfterViewInit() {
    const storedState = this.stateService.getState('incoming-requests');
    if (storedState) {
      this.filterFormGroup.patchValue(storedState.filterForm);
      this.filterRequestsBy = storedState.filterBy;
      if (storedState.sort.active) {
        this.sort.sort(({ id: storedState.sort.active, start: storedState.sort.direction}) as MatSortable);
      }
      this.paginator.pageIndex = storedState.paginator.pageIndex;
      this.paginator.pageSize = storedState.paginator.pageSize;
    }
    this.controlChange();
  }

  controlChange() {
    this.filterFormGroup.controls['payeePartyId'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "payeePartyId");
        })
      )
      .subscribe();

    this.filterFormGroup.controls['payerPartyId'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "payerPartyId");
        })
      )
      .subscribe();

    this.filterFormGroup.controls['payerDfspId'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "payerDfspId");
        })
      )
      .subscribe();

    this.filterFormGroup.controls['payerDfspName'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          const elements = this.dfspEntriesData.filter(
            (option) => option.name === filterValue.name
          );
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
          this.applyFilter(filterValue, "transactionId");
        })
      )
      .subscribe();

    this.filterFormGroup.controls['status'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "status");
        })
      )
      .subscribe();

    this.filterFormGroup.controls['businessProcessStatus'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "businessProcessStatus");
        })
      )
      .subscribe();

    this.filterFormGroup.controls['amountFrom'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "amountFrom");
        })
      )
      .subscribe();

    this.filterFormGroup.controls['amountTo'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "amountTo");
        })
      )
      .subscribe();

    this.filterFormGroup.controls['currencyCode'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          filterValue = filterValue.AlphabeticCode;
          this.applyFilter(filterValue, "currency");
        })
      )
      .subscribe();

    this.filterFormGroup.controls['transactionDateFrom'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          if (filterValue) {
            this.applyFilter(convertMomentToDate(filterValue), "startFrom");
          }
        })
      )
      .subscribe();

    this.filterFormGroup.controls['transactionDateTo'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          if (filterValue) {
            this.applyFilter(convertMomentToDate(filterValue), "startTo");
          }
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
          this.loadRequestsPayPage();
          this.stateService.setState('incoming-requests', this.filterFormGroup, this.filterRequestsBy, this.sort, this.paginator);
        })
        )
      .subscribe();

    this.loadRequestsPayPage();
  }

  onSubmit() {
    this.exportCSV(this.csvExport, this.csvName);
  }
  
  loadRequestsPayPage() {
    if (!this.sort.direction) {
       delete this.sort.active;
     }
    this.dataSource.getRequestsPay(this.filterRequestsBy, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize
    );
  }

  formatDate(date: string): string {
    return convertUtcToLocal(date);
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
    const findIndex = this.filterRequestsBy.findIndex(
      (filter) => filter.type === property
    );
    this.filterRequestsBy[findIndex].value = filterValue;
    this.stateService.setState('incoming-requests', this.filterFormGroup, this.filterRequestsBy, this.sort, this.paginator);
    this.loadRequestsPayPage();
  }

  setFilter(filterValue: string, property: string) {
    const findIndex = this.filterRequestsBy.findIndex(filter => filter.type === property);
    this.filterRequestsBy[findIndex].value = filterValue;
  }

  /**
   * Displays office name in form control input.
   * @param {any} office Office data.
   * @returns {string} Office name if valid otherwise undefined.
   */
  displayDfspName(entry?: any): string | undefined {
    return entry ? entry.name : undefined;
  }
  exportCSV(filterBy: any, filterName: string) {
    console.log(filterBy);
    var postData = filterBy.transactionid.split(",");
    console.log(postData);

    this.http
      .post(
        "/api/v1/transactionRequests/export?filterBy=" + filterBy.cars,

        postData,
        {
          responseType: "blob" as "json",
          headers: new HttpHeaders().append("Content-Type", "application/json"),
        }
      )
      .subscribe((val) => {
        console.log("POST call successful value returned in body", val);
        this.downLoadFile(val, "application/csv");
      });
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

  /**
   * Initializes the data source for transactions table and loads the first page.
   */
  getRequestsPay() {
    this.dataSource = new RequestToPayDataSource(this.requestToPayService);
    const storedState = this.stateService.getState('incoming-requests');
    if (storedState) {
      this.dataSource.getRequestsPay(storedState.filterBy, storedState.sort.active, storedState.sort.direction, storedState.paginator.pageIndex, storedState.paginator.pageSize);
    } else {
      this.dataSource.getRequestsPay(this.filterRequestsBy, '', '', 0, 10);
    }
  }

  filterRequestsByProperty(filterValue: string, property: string) {
    this.filterFormGroup.controls[property].setValue(filterValue);
    this.setFilter(filterValue, property);
  }

  navigateToTransactionsPage(transactionId: string) {
    this.router.navigate(['/paymenthubee/incomingtransactions'], { queryParams: { transactionId: transactionId } });
  }

  resetFilters() {
    this.filterFormGroup.reset({}, { emitEvent: false });
    this.paginator.pageIndex = 0;
    this.paginator.goTo = 1;
    this.filterRequestsBy.forEach(filter => {
      if (filter.type !== 'direction' && filter.type !== 'rtpDirection') {
        filter.value = '';
      }
    });
    this.stateService.clearState('incoming-requests');
    this.controlChange();
  }
}
