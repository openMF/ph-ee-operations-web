/** Angular Imports */
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {ActivatedRoute} from '@angular/router';

/** rxjs Imports */

/** Custom Services */
/** Custom Data Source */
import {MyTasksDatasource} from './my-tasks.datasource';
import {SelectionModel} from '@angular/cdk/collections';
import {ZeebeTask} from '../zeebe-tasks.model';
import {ZeebeTaskService} from '../zeebe-task.service';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {AuthenticationService} from '../../../core/authentication/authentication.service';

/**
 * Transactions component.
 */
@Component({
  selector: 'mifosx-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss']
})
export class MyTasksComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'businessKey', 'name', 'description', 'assignee', 'candidateRoles'];
  dataSource: MyTasksDatasource;
  selection = new SelectionModel<ZeebeTask>(true, []);
  name = new FormControl();

  filterTaskBy = [
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
  constructor(private tasksService: ZeebeTaskService,
              private route: ActivatedRoute,
              public dialog: MatDialog) {
  }

  /**
   * Sets filtered offices and gl accounts for autocomplete and journal entries table.
   */
  ngOnInit() {
    this.dataSource = new MyTasksDatasource(this.tasksService);
  }

  /**
   * Subscribes to all search filters:
   * Office Name, GL Account, Transaction ID, Transaction Date From, Transaction Date To,
   * sort change and page change.
   */
  ngAfterViewInit() {
    this.name.valueChanges
        .pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap((filterValue) => {
              this.applyFilter(filterValue, 'name');
            })
        )
        .subscribe();
    this.loadMyTasksPage();
  }

  /**
   * Loads a page of transactions.
   */
  loadMyTasksPage() {
    this.getMyTasks();
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
  /**
   * Initializes the data source for journal entries table and loads the first page.
   */
  getMyTasks() {
    this.dataSource.getMyTasks(this.paginator.pageIndex, this.paginator.pageSize, this.filterTaskBy);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.transactionsSubject.getValue().length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.transactionsSubject.getValue().forEach(row => this.selection.select(row));
  }

  unclaimSelected() {
    const keys = this.selection.selected.map(value => value.id);
    this.tasksService.unclaim(keys).subscribe(value => {
      this.loadMyTasksPage();
      this.selection.clear();
    });
  }

  applyFilter(filterValue: string, property: string) {
    this.paginator.pageIndex = 0;
    const findIndex = this.filterTaskBy.findIndex(filter => filter.type === property);
    this.filterTaskBy[findIndex].value = filterValue;
    this.loadMyTasksPage();
  }

  pageChanged() {
    this.loadMyTasksPage();
    this.selection.clear();
  }
}
