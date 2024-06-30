/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';

/** rxjs Imports */
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';

/** Custom Services */
import { TransactionsService } from './service/transactions.service';
import { DfspEntry } from './model/dfsp.model';
import { transactionStatusData as statuses, recallReasonData as recallReasons} from './helper/transaction.helper';
import { convertUtcToLocal } from '../../shared/date-format/date-format.helper';

/** Dialog Components */
import { BpmnDialogComponent } from '../common/bpmn-dialog/bpmn-dialog.component'
import { FormDialogComponent } from 'app/shared/form-dialog/form-dialog.component';
import { RetryResolveDialogComponent } from '../common/retry-resolve-dialog/retry-resolve-dialog.component';

/** Custom Models */
import { FormfieldBase } from 'app/shared/form-dialog/formfield/model/formfield-base';
import { InputBase } from 'app/shared/form-dialog/formfield/model/input-base';
import { SelectBase } from 'app/shared/form-dialog/formfield/model/select-base';
import { AlertService } from 'app/core/alert/alert.service';
import { AuthenticationService } from 'app/core/authentication/authentication.service';

/**
 * View transaction component.
 */
@Component({
  selector: 'mifosx-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TransactionDetailsComponent implements OnInit {

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
  transactionStatusData = statuses;
  recallReasonData = recallReasons;
  tasks: Array<any> = [];
  counter: number = 0;
  expandedElement: Array<any> = [];
  /**
   * @param {TransactionsService} transactionsService Transactions Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {MatDialog} dialog Dialog reference.
   */
  constructor(private transactionsService: TransactionsService,
    private alertService: AlertService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) {
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

  countSubTasks(transaction: any): number {
    return transaction.datasource.filteredData.length;
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
   * Retrieves the transaction data from `resolve` and sets the transaction table.
   */
  ngOnInit() {
    this.route.data.subscribe((data: { transaction: any }) => {
      this.datasource = data.transaction;
      this.setTransactionBusinessAttributes();
    });
    const source = from(this.datasource.tasks);
    const example = source.pipe(
      groupBy(transaction => transaction['elementId']),
      mergeMap(group => group.pipe(toArray()))
    );
    const subscribe = example.subscribe(val => {
      this.tasks.push(val[val.length - 1]);
      this.tasks[this.counter].datasource = new MatTableDataSource(val);
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

  formatDate(date: string): string {
    return convertUtcToLocal(date);
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

  openReturnDialog() {
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
  }

  openRecallDialog() {
    /*if (!this.hasRecallAccess()) {
      return;
    }*/
    const formfields: FormfieldBase[] = [
      new SelectBase({
        controlName: 'comment',
        label: 'Reason',
        value: this.recallReasonData[0],
        options: { label: 'name', value: 'code', data: this.recallReasonData },
        required: true,
        order: 1
      }),
      new InputBase({
        controlName: 'recallAdditionalInformation',
        label: 'Additional information',
        type: 'text',
        required: false,
        order: 2
      })
    ];
    const data = {
      title: 'Do you wish to recall this transaction?',
      layout: { addButtonText: 'Confirm' },
      formfields: formfields
    };
    const editFundDialogRef = this.dialog.open(FormDialogComponent, { data });
    editFundDialogRef.componentInstance.formSubmitted.subscribe((formData: any) => {
      if (formData.comment) {
        return this.transactionsService.recall(this.getTransferId(), formData.comment, formData.recallAdditionalInformation).subscribe(
            res => this.alertService.alert({
              type: 'Recall Success',
              message: `Recall request was successfully initiated!`
            }),
            err => this.alertService.alert({type: 'Recall Error', message: `Recall request was failed: ${err.error.defaultUserMessage}`})
        );
      }
    });
  }
}
