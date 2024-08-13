/** Angular Imports */
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortable } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/** rxjs Imports */
import { merge } from 'rxjs';
import { tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

/** Custom Services */
import { convertUtcToLocal, convertMomentToDate } from '../../../shared/date-format/date-format.helper';
import { StateService } from '../../common/state.service';

/** Shared Services */
import { MatPaginatorGotoComponent } from 'app/shared/mat-paginator-goto/mat-paginator-goto.component';

/** Custom Data Source */
import { Ig2FilesDataSource } from '../dataSource/ig2-files.datasource';
import { Ig2FilesService } from '../service/ig2-files.service';
import { RetryResolveDialogComponent } from '../../common/retry-resolve-dialog/retry-resolve-dialog.component';
import { ig2FileStatusData as statuses } from '../helper/ig2-file.helper';

/**
 * Outgoing Ig2 Files component.
 */
@Component({
  selector: 'mifosx-outgoing-ig2-files',
  templateUrl: './outgoing-ig2-files.component.html',
  styleUrls: ['./outgoing-ig2-files.component.scss']
})
export class OutgoingIg2FilesComponent implements OnInit, AfterViewInit {

  /** Minimum transaction date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum transaction date allowed. */
  maxDate = new Date();
  filterFormGroup: FormGroup;
  focusedElement: string;
  ig2FileStatusData = statuses;
  /** Columns to be displayed in transactions table. */
  displayedColumns: string[] = ['startedAt', 'completedAt', 'transactionDate', 'sessionNumber', 'listOfBics', 'status', 'actions'];
  /** Data source for transactions table. */
  dataSource: Ig2FilesDataSource;
  /** Ig2 Files filter. */
  filterIg2FilesBy = [
    {
      type: 'transactionDateFrom',
      value: ''
    },
    {
      type: 'transactionDateTo',
      value: ''
    },
    {
      type: 'sessionNumber',
      value: ''
    },
    {
      type: 'status',
      value: ''
    },
    {
      type: 'direction',
      value: 'OUT'
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
  constructor(private ig2FilesService: Ig2FilesService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private stateService: StateService,
    private formBuilder: FormBuilder) {
      this.filterFormGroup = this.formBuilder.group({
        transactionDateFrom: new FormControl(),
        transactionDateTo: new FormControl(),
        sessionNumber: new FormControl(),
        status: new FormControl()
      });  
      this.route.queryParams.subscribe(params => {
        const fileId = params['fileId'];
        if (fileId) {
          this.filterFormGroup.controls['fileId'].setValue(fileId);
          this.setFilter(fileId, 'fileId');
        }
      });
  }

  /**
   * Sets filtered offices and gl accounts for autocomplete and journal entries table.
   */
  ngOnInit() {
    this.getIg2Files();
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

  ngAfterViewInit() {
    const storedState = this.stateService.getState('outgoing-ig2-files');
    if (storedState) {
      this.filterFormGroup.patchValue(storedState.filterForm);
      this.filterIg2FilesBy = storedState.filterBy;
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
    this.filterFormGroup.controls['transactionDateFrom'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(convertMomentToDate(filterValue), 'transactionDateFrom');
        })
      )
      .subscribe();

    this.filterFormGroup.controls['transactionDateTo'].valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(convertMomentToDate(filterValue), 'transactionDateTo');
        })
      )
      .subscribe();

    this.filterFormGroup.controls['sessionNumber'].valueChanges
        .pipe(
            debounceTime(1000),
            distinctUntilChanged(),
            tap((filterValue) => {
                this.applyFilter(filterValue, 'sessionNumber');
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

    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.paginator.goTo = 1;
    });

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadIg2FilesPage();
          this.stateService.setState('outgoing-ig2-files', this.filterFormGroup, this.filterIg2FilesBy, this.sort, this.paginator);
        })
        )
      .subscribe();

    this.loadIg2FilesPage();    
  }

  /**
   * Loads a page of recalls.
   */
  loadIg2FilesPage() {
    if (!this.sort.direction) {
      delete this.sort.active;
    }
    this.dataSource.getIg2Files(this.filterIg2FilesBy, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
  }

  /**
   * Filters data in transactions table based on passed value and poperty.
   * @param {string} filterValue Value to filter data.
   * @param {string} property Property to filter data by.
   */
  applyFilter(filterValue: string, property: string) {
    this.paginator.pageIndex = 0;
    const findIndex = this.filterIg2FilesBy.findIndex(filter => filter.type === property);
    this.filterIg2FilesBy[findIndex].value = filterValue;
    this.stateService.setState('outgoing-recalls', this.filterFormGroup, this.filterIg2FilesBy, this.sort, this.paginator);
    this.loadIg2FilesPage();
  }

  setFilter(filterValue: string, property: string) {
    const findIndex = this.filterIg2FilesBy.findIndex(filter => filter.type === property);
    this.filterIg2FilesBy[findIndex].value = filterValue;
  }

  shortenValue(value: any) {
    return value && value.length > 15 ? value.slice(0, 13) + '...' : value;
  }

  formatDate(date: string): string {
    return convertUtcToLocal(date);
  }

  /**
   * Initializes the data source for transactions table and loads the first page.
   */
  getIg2Files() {
    this.dataSource = new Ig2FilesDataSource(this.ig2FilesService);
    const storedState = this.stateService.getState('outgoing-ig2-files');
    if (storedState) {
      this.dataSource.getIg2Files(storedState.filterBy, storedState.sort.active, storedState.sort.direction, storedState.paginator.pageIndex, storedState.paginator.pageSize);
    } else {
      this.dataSource.getIg2Files(this.filterIg2FilesBy, '', '', 0, 10);
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

  resetFilters() {
    this.filterFormGroup.reset({}, { emitEvent: false });
    this.paginator.pageIndex = 0;
    this.paginator.goTo = 1;
    this.filterIg2FilesBy.forEach(filter => {
      if (filter.type !== 'direction') {
        filter.value = '';
      }
    });
    this.stateService.clearState('outgoing-ig2-files');
    this.controlChange();
  }

}
