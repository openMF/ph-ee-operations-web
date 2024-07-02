/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';

/** rxjs Imports */
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';

/** Custom Services */
import { Ig2FilesService } from './service/ig2-files.service';
import { convertUtcToLocal } from '../../shared/date-format/date-format.helper';
import { ig2FileStatusData as ig2FileStatuses } from './helper/ig2-file.helper';

/** Dialog Components */
import { BpmnDialogComponent } from '../common/bpmn-dialog/bpmn-dialog.component'
import { RetryResolveDialogComponent } from '../common/retry-resolve-dialog/retry-resolve-dialog.component';

/** Custom Models */
import { FormfieldBase } from 'app/shared/form-dialog/formfield/model/formfield-base';
import { InputBase } from 'app/shared/form-dialog/formfield/model/input-base';
import { AlertService } from 'app/core/alert/alert.service';
import { AuthenticationService } from 'app/core/authentication/authentication.service';

/**
 * View Ig2 File component.
 */
@Component({
  selector: 'mifosx-ig2-file-details',
  templateUrl: './ig2-file-details.component.html',
  styleUrls: ['./ig2-file-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Ig2FileDetailsComponent implements OnInit {

  // TODO: Update once language and date settings are setup

  /** Transaction data.  */
  datasource: any;
  /** Transaction ID. */
  transactionId: string;
  /** Columns to be displayed in transaction table. */
  displayedColumns: string[] = ['timestamp', 'elementId', 'type', 'intent', 'actions'];
  displayedColumnsDetailsTable: string[] = ['timestamp', 'elementId', 'type', 'intent'];
  displayedBusinessAttributeColumns: string[] = ['name', 'value'];
  /** Data source for transaction table. */
  taskList: MatTableDataSource<any>;
  businessAttributes: MatTableDataSource<any>;
  ig2FileStatusData = ig2FileStatuses;
  tasks: Array<any> = [];
  counter: number = 0;
  expandedElement: Array<any> = [];
  /**
   * @param {Ig2FilesService} ig2FilesService Ig2 Files Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {MatDialog} dialog Dialog reference.
   */
  constructor(private ig2FilesService: Ig2FilesService,
    private alertService: AlertService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) {}

  checkExpanded(transaction: any): boolean {
    let flag = false;
    this.expandedElement.forEach(e => {
      if (e === transaction) {
        flag = true;

      }
    });
    return flag;
  }

  pushPopElement(transaction: any) {
    const index = this.expandedElement.indexOf(transaction);
    if (index === -1) {
      this.expandedElement.push(transaction);
    } else {
      this.expandedElement.splice(index, 1);
    }
  }

  /**
   * Retrieves the ig2 file data from `resolve` and sets the transaction table.
   */
  ngOnInit() {
    this.route.data.subscribe((data: { ig2File: any }) => {
      this.datasource = data.ig2File;
      this.setTransactionBusinessAttributes();
    });
    const source = from(this.datasource.tasks);
    const example = source.pipe(
      groupBy(transaction => transaction['elementId']),
      mergeMap(group => group.pipe(toArray()))
    );
    const subscribe = example.subscribe(val => {
      this.tasks.push(val[val.length - 1]);
      this.tasks[this.counter].datasource = new MatTableDataSource(val.slice(0, val.length - 1));
      this.tasks[this.counter].datasource.sortingDataAccessor = (transaction: any, property: any) => {
        return transaction[property];
      };
      this.counter++;
    });
    this.setTransactionTaskList();
  }

  /**
   * Initializes the data source for transaction table with journal entries, paginator and sorter.
   */
  setTransactionTaskList() {
    this.taskList = new MatTableDataSource(this.tasks);
    this.taskList.sortingDataAccessor = (transaction: any, property: any) => {
      return transaction[property];
    };
  }

  setTransactionBusinessAttributes() {
    this.businessAttributes = new MatTableDataSource(this.datasource.variables);
    this.businessAttributes.sortingDataAccessor = (transaction: any, property: any) => {
      return transaction[property];
    };
  }

  formatDate(date: string): string {
    return convertUtcToLocal(date);
  }

  getPaymentProcessId() {
    return this.datasource.transfer.workflowInstanceKey;
  }

  getTransferId() {
    return this.datasource.transfer.transactionId;
  }

  cleanse(unformatted: any) {
    return unformatted ? unformatted.replace(/\\n|\\r|\\t/gm, '').replace(/\\"/gi, '"') : undefined;
  }

  openBPMNDialog() {
    const bpmnDialogRef = this.dialog.open(BpmnDialogComponent, {
      data: {
        datasource: this.datasource
      },
    });
  }

  openRetryResolveDialog(workflowInstanceKey: any, action: string) {
    const retryResolveDialogRef = this.dialog.open(RetryResolveDialogComponent, {
      data: {
        action: action,
        workflowInstanceKey: workflowInstanceKey
      },
    });
  }

}
