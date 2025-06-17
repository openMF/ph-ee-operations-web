/** Angular Imports */
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

/** rxjs Imports */
import { from } from "rxjs";
import { groupBy, mergeMap, toArray } from "rxjs/operators";

/** Custom Services */
import { RequestToPayService } from "../service/request-to-pay.service";
import { formatDate, formatUTCDate } from "../helper/date-format.helper";
import { DfspEntry } from "../model/dfsp.model";
import { requestToPayStatesData as statuses } from "../helper/request-to-pay.helper";
import { MatomoService } from "app/core/analytics/matomo.service";

@Component({
  selector: "mifosx-view-request-to-pay",
  templateUrl: "./view-request-to-pay.component.html",
  styleUrls: ["./view-request-to-pay.component.scss"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class ViewRequestToPayComponent implements OnInit {
  // TODO: Update once language and date settings are setup

  /** Transaction data.  */
  datasource: any;
  /** Transaction ID. */
  transactionId: string;
  /** Columns to be displayed in transaction table. */
  displayedColumns: string[] = [
    "timestamp",
    "elementId",
    "type",
    "intent",
    "actions",
  ];
  displayedColumnsDetailsTable: string[] = [
    "timestamp",
    "elementId",
    "type",
    "intent",
  ];
  displayedBusinessAttributeColumns: string[] = ["name", "timestamp", "value"];
  /** Data source for transaction table. */
  taskList: MatTableDataSource<any>;
  businessAttributes: MatTableDataSource<any>;
  dfspEntriesData: DfspEntry[];
  transactionStatusData = statuses;
  tasks: Array<any> = [];
  counter: number = 0;
  expandedElement: Array<any> = [];
  requestToPayData: any;

  constructor(
    private requestToPayService: RequestToPayService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private matomoService: MatomoService
  ) {
    this.route.data.subscribe((data: { requestToPay: any }) => {
      this.requestToPayData = data.requestToPay;
    });
    console.log(this.requestToPayData);
    this.route.data.subscribe((data: { dfspEntries: DfspEntry[] }) => {
      this.dfspEntriesData = data.dfspEntries;
    });
  }

  checkExpanded(transaction: any): boolean {
    let flag = false;
    this.expandedElement.forEach((e) => {
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
      this.onTransactionRowExpand(transaction);
    } else {
      this.expandedElement.splice(index, 1);
      this.matomoService.trackEvent(
        "Table",
        "Row Collapse",
        "Transaction Task List",
        1
      );
      this.trackBusinessMetric("transaction_row_collapses", 1, "collapses");
    }
  }

  /**
   * Retrieves the transaction data from `resolve` and sets the transaction table.
   */
  ngOnInit() {
    // Track page view
    this.trackPageView();
    this.setupAnalytics();

    this.route.data.subscribe((data: { requestToPay: any }) => {
      this.datasource = data.requestToPay;
      this.setTransactionBusinessAttributes();
    });
    const source = from(this.datasource.tasks);
    const example = source.pipe(
      groupBy((transaction: any) => transaction["type"]),
      mergeMap((group) => group.pipe(toArray()))
    );
    const subscribe = example.subscribe((val) => {
      this.tasks.push(val[val.length - 1]);
      this.tasks[this.counter].datasource = new MatTableDataSource(
        val.slice(0, val.length - 1)
      );
      this.tasks[this.counter].datasource.sortingDataAccessor = (
        transaction: any,
        property: any
      ) => {
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
    this.businessAttributes.sortingDataAccessor = (
      transaction: any,
      property: any
    ) => {
      return transaction[property];
    };
  }

  convertTimestampToDate(timestamp: any) {
    if (!timestamp) {
      return undefined;
    }
    return formatUTCDate(new Date(timestamp));
  }

  formatDate(date: string) {
    if (!date) {
      return undefined;
    }
    date = date.toString();
    date = date.replace("+0000", "");
    date = date.replace("T", " ");
    date = date.replace(".000", "");
    return date;
  }

  getPaymentProcessId() {
    return this.datasource.transactionRequest.workflowInstanceKey;
  }

  cleanse(unformatted: any) {
    return unformatted
      ? unformatted.replace(/\\n|\\r|\\t/gm, "").replace(/\\"/gi, '"')
      : undefined;
  }

  getDfpsEntry(dfpsId?: any): DfspEntry | undefined {
    const elements = this.dfspEntriesData.filter(
      (option) => option.id === dfpsId
    );
    return elements.length > 0 ? elements[0] : undefined;
  }

  displayDfspName(entry?: any): string | undefined {
    return entry ? entry.name : undefined;
  }
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
   * Track page view for view request to pay
   */
  trackPageView(): void {
    const transactionId =
      this.requestToPayData?.transactionRequest?.transactionId || "unknown";
    this.matomoService.trackPageView(
      `View Request to Pay - ${transactionId}`,
      `/payment-hub/request-to-pay/view/${transactionId}`
    );
  }

  /**
   * Setup initial analytics configuration
   */
  setupAnalytics(): void {
    this.matomoService.trackEvent("Page", "Loaded", "View Request to Pay", 1);
    this.trackBusinessMetric("view_request_to_pay_loaded", 1, "views");
  }

  /**
   * Track transaction row expansion
   */
  onTransactionRowExpand(transaction: any): void {
    this.matomoService.trackEvent(
      "Table",
      "Row Expand",
      "Transaction Task List",
      1
    );
    this.trackBusinessMetric("transaction_row_expansions", 1, "expansions");

    if (transaction?.type) {
      this.matomoService.trackEvent(
        "Table",
        "Row Expand Type",
        `Transaction Type: ${transaction.type}`,
        1
      );
    }
  }

  /**
   * Track table sorting interactions
   */
  onTableSort(sortHeader: string, table: string): void {
    this.matomoService.trackEvent(
      "Table",
      "Sort",
      `${table} - ${sortHeader}`,
      1
    );
    this.trackBusinessMetric("table_sort_interactions", 1, "sorts");
  }

  /**
   * Track payer information views
   */
  onPayerInfoView(): void {
    this.matomoService.trackEvent(
      "View",
      "Payer Info",
      "Request to Pay Details",
      1
    );
    this.trackBusinessMetric("payer_info_views", 1, "views");
  }

  /**
   * Track payee information views
   */
  onPayeeInfoView(): void {
    this.matomoService.trackEvent(
      "View",
      "Payee Info",
      "Request to Pay Details",
      1
    );
    this.trackBusinessMetric("payee_info_views", 1, "views");
  }

  /**
   * Track transfer information views
   */
  onTransferInfoView(): void {
    this.matomoService.trackEvent(
      "View",
      "Transfer Info",
      "Request to Pay Details",
      1
    );
    this.trackBusinessMetric("transfer_info_views", 1, "views");
  }

  /**
   * Track fees information views
   */
  onFeesInfoView(): void {
    this.matomoService.trackEvent(
      "View",
      "Fees Info",
      "Request to Pay Details",
      1
    );
    this.trackBusinessMetric("fees_info_views", 1, "views");
  }

  /**
   * Track business attributes table interactions
   */
  onBusinessAttributesView(): void {
    this.matomoService.trackEvent(
      "View",
      "Business Attributes",
      "Transaction Details",
      1
    );
    this.trackBusinessMetric("business_attributes_views", 1, "views");
  }

  /**
   * Track task list interactions
   */
  onTaskListView(): void {
    this.matomoService.trackEvent(
      "View",
      "Task List",
      "Transaction Details",
      1
    );
    this.trackBusinessMetric("task_list_views", 1, "views");
  }

  /**
   * Track performance metrics
   */
  trackPerformanceMetric(metricName: string, value: number): void {
    this.matomoService.trackEvent(
      "Performance",
      metricName,
      "View Request to Pay",
      value
    );
    this.trackBusinessMetric(
      `performance_${metricName.toLowerCase()}`,
      value,
      "milliseconds"
    );
  }

  /**
   * Track business metrics
   */
  private trackBusinessMetric(
    metric: string,
    value: number,
    unit: string
  ): void {
    this.matomoService.trackBusinessMetric(metric, value, unit);
  }
}
