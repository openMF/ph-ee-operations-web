/** Angular Imports */
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

/** rxjs Imports */
import { merge } from 'rxjs';
import { tap, startWith, map, distinctUntilChanged, debounceTime } from 'rxjs/operators';

/** Custom Services */
import { RequestToPayService } from '../service/request-to-pay.service';
import { formatDateForDisplay, convertMomentToDate } from '../../../shared/date-format/date-format.helper';

/** Custom Data Source */
import { transactionStatusData as statuses } from "../helper/incoming-request.helper";
import { paymentStatusData as paymenStatuses } from "../helper/incoming-request.helper";

import { DfspEntry } from '../model/dfsp.model';
import { RequestToPayDataSource } from "../dataSource/requestToPay.datasource";
@Component({
  selector: 'mifosx-outgoing-request-to-pay',
  templateUrl: './outgoing-request-to-pay.component.html',
  styleUrls: ['./outgoing-request-to-pay.component.scss']
})
export class OutgoingRequestToPayComponent implements OnInit {

  /** Minimum transaction date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum transaction date allowed. */
  maxDate = new Date();
  filterForm: FormGroup;
  filteredCurrencies: any;
  filteredDfspEntries: any;
  currenciesData: any;
  dfspEntriesData:  DfspEntry[];
  transactionStatusData = statuses;
  paymentStatusData = paymenStatuses;
  /** Columns to be displayed in request to pay table. */
  displayedColumns: string[] = ['startedAt', 'completedAt', 'transactionId', 'payerPartyId', 'payeePartyId', 'payerDfspId','payerDfspName', 'amount', 'currency', 'status', 'actions'];
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
        value: "OUTGOING",
      },
      {
        type: "rtpDirection",
        value: "OUTGOING",
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
        type: 'paymentStatus',
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for requesttopay table. */
  @ViewChild(MatSort) sort: MatSort;

  constructor(private requestToPayService: RequestToPayService,
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
  }

  ngAfterViewInit() {
    this.controlChange();
  }

  controlChange() {
    this.filterForm.controls['payeePartyId'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "payeePartyId");
        })
      )
      .subscribe();

    this.filterForm.controls['payerPartyId'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "payerPartyId");
        })
      )
      .subscribe();

    this.filterForm.controls['payerDfspId'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "payerDfspId");
        })
      )
      .subscribe();

    this.filterForm.controls['payerDfspName'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          const elements = this.dfspEntriesData.filter(
            (option) => option.name === filterValue.name
          );
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
          if (filterValue.length > 5) {
            this.applyFilter(filterValue, "transactionId");
          }
        })
      )
      .subscribe();

    this.filterForm.controls['status'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "status");
        })
      )
      .subscribe();

    this.filterForm.controls['paymentStatus'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "paymentStatus");
        })
      )
      .subscribe();

    this.filterForm.controls['amountFrom'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "amountFrom");
        })
      )
      .subscribe();

    this.filterForm.controls['amountTo'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, "amountTo");
        })
      )
      .subscribe();

    this.filterForm.controls['currencyCode'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          filterValue = filterValue.AlphabeticCode;
          this.applyFilter(filterValue, "currency");
        })
      )
      .subscribe();

    this.filterForm.controls['transactionDateFrom'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          if (filterValue) {
            this.applyFilter(convertMomentToDate(filterValue), "startFrom");
          }
        })
      )
      .subscribe();

    this.filterForm.controls['transactionDateTo'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          if (filterValue) {
            this.applyFilter(convertMomentToDate(filterValue), "startTo");
          }
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadRequestsPayPage())
      )
      .subscribe();

    this.loadRequestsPayPage();
  }

  loadRequestsPayPage() {
    if (!this.sort.direction) {
       delete this.sort.active;
     }
    this.dataSource.getRequestsPay(this.filterRequestsBy, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize
    );
  }

  formatDate(date: string): string {
    return formatDateForDisplay(date);
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
    const findIndex = this.filterRequestsBy.findIndex(
      (filter) => filter.type === property
    );
    this.filterRequestsBy[findIndex].value = filterValue;
    this.loadRequestsPayPage();
  }
  /**
   * Displays office name in form control input.
   * @param {any} office Office data.
   * @returns {string} Office name if valid otherwise undefined.
   */
  displayDfspName(entry?: any): string | undefined {
    return entry ? entry.name : undefined;
  }

  getRequestsPay() {
    this.dataSource = new RequestToPayDataSource(this.requestToPayService);
    if (this.sort && this.paginator) {
      this.dataSource.getRequestsPay(this.filterRequestsBy, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
    } else {
      this.dataSource.getRequestsPay(this.filterRequestsBy, '', '', 0, 10);
    }
  }

  filterRequestsByProperty(filterValue: string, property: string) {
    this.filterForm.controls[property].setValue(filterValue);
    this.applyFilter(filterValue, property);
  }

  navigateToTransactionsPage(transactionId: string) {
    this.router.navigate(['/paymenthubee/outgoingtransactions'], { queryParams: { transactionId: transactionId } });
  }

  resetFilters() {
    this.filterForm.reset({}, { emitEvent: false });
    this.paginator.pageIndex = 0;
    this.filterRequestsBy.forEach(filter => {
      if (filter.type !== 'direction' && filter.type !== 'rtpDirection') {
        filter.value = '';
      }
    });
    this.controlChange();
  }

}
