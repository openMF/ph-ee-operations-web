/** Angular Imports */
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {FormControl} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

/** rxjs Imports */
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';

/** Custom Services */
/** Custom Data Source */
import {RetryResolveDialogComponent} from '../../common/retry-resolve-dialog/retry-resolve-dialog.component';
import {ListTasksDatasource} from './list-tasks.datasource';
import {SelectionModel} from '@angular/cdk/collections';
import {ZeebeTask} from '../zeebe-tasks.model';
import {ZeebeTaskService} from '../zeebe-task.service';
import {AuthenticationService} from '../../../core/authentication/authentication.service';

/**
 * Transactions component.
 */
@Component({
  selector: 'mifosx-assignable-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'businessKey', 'name', 'description', 'assignee', 'candidateRoles', 'previousSubmitters', 'assignable'];
  dataSource: ListTasksDatasource;
  selection = new SelectionModel<ZeebeTask>(true, []);
  taskState = new FormControl();
  name = new FormControl();
  assignee = new FormControl();
  candidateRole = new FormControl();
  previousSubmitter = new FormControl();
  userName: string;
  taskStates = [
    {
      option: 'All',
      value: 'ALL',
      css: 'green'
    },
    {
      option: 'Assignable',
      value: 'ASSIGNABLE',
      css: 'red'
    },
    {
      option: '',
      value: 'UNKNOWN',
      hidden: true
    }
  ];

  filterTaskBy = [
    {
      type: 'taskState',
      value: ''
    },
    {
      type: 'assignee',
      value: ''
    },
    {
      type: 'candidateRole',
      value: ''
    },
    {
      type: 'previousSubmitter',
      value: ''
    },
    {
      type: 'name',
      value: ''
    }
  ];

  /** Paginator for transactions table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Retrieves the offices and gl accounts data from `resolve`.
   * @param {AccountingService} accountingService Accounting Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {MatDialog} dialog Dialog reference.
   */
  constructor(private taskService: ZeebeTaskService,
              private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
  }
  ngOnInit() {
    const credentials = this.authenticationService.getCredentials();
    this.userName = credentials.username;
    this.dataSource = new ListTasksDatasource(this.taskService);
  }
  ngAfterViewInit() {
    this.taskState.valueChanges
        .pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap((filterValue) => {
              this.applyFilter(filterValue, 'taskState');
            })
        )
        .subscribe();

    this.assignee.valueChanges
        .pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap((filterValue) => {
              this.applyFilter(filterValue, 'assignee');
            })
        )
        .subscribe();

    this.candidateRole.valueChanges
        .pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap((filterValue) => {
              this.applyFilter(filterValue, 'candidateRole');
            })
        )
        .subscribe();

    this.previousSubmitter.valueChanges
        .pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap((filterValue) => {
              this.applyFilter(filterValue, 'previousSubmitter');
            })
        )
        .subscribe();

    this.name.valueChanges
        .pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap((filterValue) => {
              this.applyFilter(filterValue, 'name');
            })
        )
        .subscribe();
    this.loadTasksPage();
  }

  /**
   * Loads a page of transactions.
   */
  loadTasksPage() {
    this.getTasks();
  }
  formatDate(date: string)  {
    if (!date) {
      return undefined;
    }
    date = date.toString();
    date = date.replace('+0000', '');
    date = date.replace('T', ' ');
    date = date.replace('.000', '');
    return date;
  }
  /**
   * Initializes the data source for journal entries table and loads the first page.
   */
  getTasks() {
    this.dataSource.listTasks(this.paginator.pageIndex, this.paginator.pageSize, this.filterTaskBy);
  }

  openRetryResolveDialog(workflowInstanceKey: any, action: string) {
    const retryResolveDialogRef = this.dialog.open(RetryResolveDialogComponent, {
      data: {
        action: action,
        workflowInstanceKey: workflowInstanceKey
      },
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.transactionsSubject.getValue().filter(value => value.assignable).length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.transactionsSubject.getValue().filter(value => value.assignable).forEach(row => this.selection.select(row));
  }

  claimSelected() {
    const keys = this.selection.selected.map(value => value.id);
    this.taskService.claim(keys).subscribe(value => {
      this.loadTasksPage();
      this.selection.clear();
    });
  }

  applyFilter(filterValue: string, property: string) {
    this.paginator.pageIndex = 0;
    const findIndex = this.filterTaskBy.findIndex(filter => filter.type === property);
    this.filterTaskBy[findIndex].value = filterValue;
    this.loadTasksPage();
  }

  pageChanged() {
    this.loadTasksPage();
    this.selection.clear();
  }

  decideRoute(row: any) {
    return row.assignee === this.userName ? '/paymenthubee/mytasks/view' : '/paymenthubee/listtasks/view';
  }
}
