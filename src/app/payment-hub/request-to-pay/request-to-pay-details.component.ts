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
import { RequestToPayService } from './service/request-to-pay.service';
import { convertUtcToLocal } from '../../shared/date-format/date-format.helper';
import { DfspEntry } from './model/dfsp.model';
import { requestToPayStatesData as statuses } from './helper/request-to-pay.helper';

@Component({
  selector: 'mifosx-request-to-pay-details',
  templateUrl: './request-to-pay-details.component.html',
  styleUrls: ['./request-to-pay-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RequestToPayDetailsComponent implements OnInit {

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
  tasks: Array<any> = [];
  counter: number = 0;
  expandedElement: Array<any> = [];
  requestToPayData: any;

  constructor(private requestToPayService: RequestToPayService,
  	private route: ActivatedRoute,
  	private router: Router,
    public dialog: MatDialog,
    private clipboard: Clipboard) { 
    this.route.data.subscribe((data: { requestToPay: any }) => {
      this.requestToPayData = data.requestToPay;
    });
    this.route.data.subscribe((data: {
      dfspEntries: DfspEntry[]
    }) => {
      this.dfspEntriesData = data.dfspEntries;
    });
  }

  checkExpanded(transaction: any): boolean {
    let flag = false;
    this.expandedElement.forEach(e => {
      if(e === transaction) {
        flag = true;
        
      }
    });
    return flag;
  }

  pushPopElement(transaction: any) {
    const index = this.expandedElement.indexOf(transaction);
    if(index === -1) {
        this.expandedElement.push(transaction);
    } else {
      this.expandedElement.splice(index,1);
    }
  }

  /**
   * Retrieves the transaction data from `resolve` and sets the transaction table.
   */
  ngOnInit() {
    this.route.data.subscribe((data: { requestToPay: any }) => {
      this.datasource = data.requestToPay;
      this.setTransactionBusinessAttributes();
    });
	const source = from(this.datasource.tasks);
	const example = source.pipe(
 	 groupBy(transaction => transaction['elementId']),
  	 mergeMap(group => group.pipe(toArray()))
	);
	const subscribe = example.subscribe(val => {
		this.tasks.push(val[val.length-1]);
		this.tasks[this.counter].datasource = new MatTableDataSource(val.slice(0,val.length-1));
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

  formatDate(date: string): string{
    return convertUtcToLocal(date);
  }

  getPaymentProcessId() {
    return this.datasource.transfer.workflowInstanceKey;
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

  onCopy(event: ClipboardEvent) {
    event.preventDefault();
    const inputElement = event.target as HTMLInputElement;
    const text = inputElement.value.replace(/\s+/g, '');
    this.clipboard.copy(text);
  }

}
