/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Clipboard } from '@angular/cdk/clipboard';

/** rxjs Imports */
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';

/** Custom Services */
import { RecallsService } from './service/recalls.service';
import { convertUtcToLocal } from '../../shared/date-format/date-format.helper';
import { DfspEntry } from './model/dfsp.model';
import { transactionStatusData as transactionStatuses } from './helper/recall.helper';

/** Dialog Components */
import { BpmnDialogComponent } from '../common/bpmn-dialog/bpmn-dialog.component'
import { RetryResolveDialogComponent } from '../common/retry-resolve-dialog/retry-resolve-dialog.component';

/** Custom Models */
import { AlertService } from 'app/core/alert/alert.service';
import { AuthenticationService } from 'app/core/authentication/authentication.service';

/**
 * View recall component.
 */
@Component({
  selector: 'mifosx-recall-details',
  templateUrl: './recall-details.component.html',
  styleUrls: ['./recall-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RecallDetailsComponent implements OnInit {

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
  dfspEntriesData: DfspEntry[];
  transactionStatusData = transactionStatuses;
  tasks: Array<any> = [];
  counter: number = 0;
  expandedElement: Array<any> = [];
  /**
   * @param {RecallsService} recallsService Recalls Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {MatDialog} dialog Dialog reference.
   */
  constructor(private recallsService: RecallsService,
    private alertService: AlertService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private clipboard: Clipboard) {
    this.route.data.subscribe((data: {
      dfspEntries: DfspEntry[]
    }) => {
      this.dfspEntriesData = data.dfspEntries;
    });
  }

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
   * Retrieves the recall data from `resolve` and sets the transaction table.
   */
  ngOnInit() {
    this.route.data.subscribe((data: { recall: any }) => {
      this.datasource = data.recall;
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

  getDfpsEntry(dfpsId?: any): DfspEntry | undefined {
    const elements = this.dfspEntriesData.filter((option) => option.id === dfpsId);
    return elements.length > 0 ? elements[0] : undefined;
  }


  displayDfspName(entry?: any): string | undefined {
    return entry ? entry.name : undefined;
  }
  displayStatus(status?: any): string | undefined {
    const elements = this.transactionStatusData.filter((option) => option.value === status);
    return elements.length > 0 ? elements[0].option : undefined;
  }

  displayCSS(status?: any): string | undefined {

    const elements = this.transactionStatusData.filter((option) => option.value === status);
    return elements.length > 0 ? elements[0].css : undefined;
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

  hasRefundAccess() {
    return this.datasource.transfer.direction === 'INCOMING' && this.authService.hasAccess('REFUND');
  }

  hasRecallAccess() {
    return this.datasource.transfer.direction === 'OUTGOING' && this.authService.hasAccess('RECALL');
  }

  onCopy(event: ClipboardEvent) {
    event.preventDefault();
    const inputElement = event.target as HTMLInputElement;
    const text = inputElement.value.replace(/\s+/g, '');
    this.clipboard.copy(text);
  }

  //TODO: @vector details-ből mit lehet csinálni a recall-al
  /*openReturnDialog() {
    if (!this.hasRefundAccess()) {
      return;
    }
    const formfields: FormfieldBase[] = [
      new InputBase({
        controlName: 'comment',
        label: 'Comment',
        type: 'text',
        required: true
      }),
    ];
    const data = {
      title: 'Comment',
      layout: { addButtonText: 'Confirm' },
      formfields: formfields
    };
    const editFundDialogRef = this.dialog.open(FormDialogComponent, { data });
    editFundDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        return this.transactionsService.refund(this.getTransferId(), response.data.value).subscribe(
          res => this.alertService.alert({ type: 'Refund Success', message: `Refund request was successfully initiated!` }),
          err => this.alertService.alert({ type: 'Refund Error', message: `Refund request was failed` })
        );
      }
    });
  }*/


  //TODO: @vector details-ből mit lehet csinálni a recall-al
  /*openRecallDialog() {
    if (!this.hasRecallAccess()) {
      return;
    }
    const formfields: FormfieldBase[] = [
      new InputBase({
        controlName: 'comment',
        label: 'Reason',
        type: 'text',
        required: false
      }),
    ];
    const data = {
      title: 'Do you wish to recall this transaction?',
      layout: { addButtonText: 'Confirm' },
      formfields: formfields
    };
    const editFundDialogRef = this.dialog.open(FormDialogComponent, { data });
    editFundDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        return this.transactionsService.recall(this.getTransferId()).subscribe(
            res => this.alertService.alert({
              type: 'Recall Success',
              message: `Recall request was successfully initiated!`
            }),
            err => this.alertService.alert({type: 'Recall Error', message: `Recall request was failed`})
        );
      }
    });
  }*/
}
