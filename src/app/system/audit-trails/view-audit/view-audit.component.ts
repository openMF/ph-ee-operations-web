/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

/** Custom Services */
import { MatomoService } from 'app/core/analytics/matomo.service';

/**
 * View Audit Component.
 */
@Component({
  selector: 'mifosx-view-audit',
  templateUrl: './view-audit.component.html',
  styleUrls: ['./view-audit.component.scss'],
})
export class ViewAuditComponent implements OnInit {
  /** Audit Trail Data. */
  auditTrailData: any;
  /** Columns to be displayed in audit trail table. */
  displayedColumns: string[] = ['command', 'commandValue'];
  /** Data source for audit trail table. */
  dataSource: MatTableDataSource<any>;

  /** Paginator for audit trails table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for audit trails table. */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Retrieves the audit trail data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(
    private route: ActivatedRoute,
    private matomoService: MatomoService
  ) {
    this.route.data.subscribe((data: { auditTrail: any }) => {
      this.auditTrailData = data.auditTrail;
    });
  }

  /**
   * Sets the audit trail commands table.
   */
  ngOnInit() {
    // Track page view
    this.trackPageView();
    this.setupAnalytics();
    this.setAuditTrailCommands();
  }

  /**
   * Initalizes Audit Trail Commands Data.
   */
  get auditTrailCommandsData() {
    return Object.entries(JSON.parse(this.auditTrailData.commandAsJson)).map(
      ([key, value]) => ({ command: key, commandValue: value })
    );
  }

  /**
   * Initializes the data source, paginator and sorter for audit trail commands table.
   */
  setAuditTrailCommands() {
    this.dataSource = new MatTableDataSource(this.auditTrailCommandsData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Track page view for audit trail details
   */
  trackPageView(): void {
    const auditId = this.auditTrailData?.id || 'unknown';
    this.matomoService.trackPageView(
      `View Audit Trail - ${auditId}`,
      `/system/audit-trails/view/${auditId}`
    );
  }

  /**
   * Setup initial analytics configuration
   */
  setupAnalytics(): void {
    this.matomoService.trackEvent('Page', 'Loaded', 'View Audit Trail', 1);
    this.trackBusinessMetric('view_audit_trail_loaded', 1, 'views');

    // Track audit trail metadata
    if (this.auditTrailData) {
      this.trackAuditMetadata();
    }
  }

  /**
   * Track audit trail metadata for business intelligence
   */
  trackAuditMetadata(): void {
    const auditData = this.auditTrailData;

    // Track action type
    if (auditData.actionName) {
      this.matomoService.trackEvent(
        'Audit',
        'Action Type',
        auditData.actionName,
        1
      );
    }

    // Track entity type
    if (auditData.entityName) {
      this.matomoService.trackEvent(
        'Audit',
        'Entity Type',
        auditData.entityName,
        1
      );
    }

    // Track processing result
    if (auditData.processingResult) {
      this.matomoService.trackEvent(
        'Audit',
        'Processing Result',
        auditData.processingResult,
        1
      );
    }

    // Track office if available
    if (auditData.officeName) {
      this.matomoService.trackEvent('Audit', 'Office', auditData.officeName, 1);
    }

    this.trackBusinessMetric('audit_metadata_tracked', 1, 'metadata');
  }

  /**
   * Track audit details card interactions
   */
  onAuditDetailsView(): void {
    this.matomoService.trackEvent(
      'View',
      'Audit Details',
      'Audit Information Card',
      1
    );
    this.trackBusinessMetric('audit_details_views', 1, 'views');
  }

  /**
   * Track command table interactions
   */
  onCommandTableView(): void {
    this.matomoService.trackEvent(
      'View',
      'Command Table',
      'Audit Commands Data',
      1
    );
    this.trackBusinessMetric('command_table_views', 1, 'views');
  }

  /**
   * Track table sorting interactions
   */
  onTableSort(sortHeader: string): void {
    this.matomoService.trackEvent(
      'Table',
      'Sort',
      `Audit Commands - ${sortHeader}`,
      1
    );
    this.trackBusinessMetric('table_sort_interactions', 1, 'sorts');
  }

  /**
   * Track specific command value interactions
   */
  onCommandValueView(command: string): void {
    this.matomoService.trackEvent(
      'View',
      'Command Value',
      `Command: ${command}`,
      1
    );
    this.trackBusinessMetric('command_value_views', 1, 'views');
  }

  /**
   * Track user email interactions
   */
  onUserEmailView(): void {
    this.matomoService.trackEvent('View', 'User Email', 'Audit Trail User', 1);
    this.trackBusinessMetric('user_email_views', 1, 'views');
  }

  /**
   * Track resource ID interactions
   */
  onResourceIdView(): void {
    this.matomoService.trackEvent(
      'View',
      'Resource ID',
      'Audit Trail Resource',
      1
    );
    this.trackBusinessMetric('resource_id_views', 1, 'views');
  }

  /**
   * Track date information interactions
   */
  onDateView(): void {
    this.matomoService.trackEvent(
      'View',
      'Date Information',
      'Audit Trail Date',
      1
    );
    this.trackBusinessMetric('date_info_views', 1, 'views');
  }

  /**
   * Track performance metrics
   */
  trackPerformanceMetric(metricName: string, value: number): void {
    this.matomoService.trackEvent(
      'Performance',
      metricName,
      'View Audit Trail',
      value
    );
    this.trackBusinessMetric(
      `performance_${metricName.toLowerCase()}`,
      value,
      'milliseconds'
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
