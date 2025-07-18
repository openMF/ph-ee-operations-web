/** Angular Imports */
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

/** Custom Data Source */
import { AuditTrailsDataSource } from './audit-trail.datasource';

/** Custom Services */
import { SystemService } from '../system.service';
import { MatomoService } from 'app/core/analytics/matomo.service';

/** rxjs Imports */
import { merge } from 'rxjs';
import {
  tap,
  debounceTime,
  distinctUntilChanged,
  startWith,
  map,
} from 'rxjs/operators';

/**
 * Audit Trails Component.
 */
@Component({
  selector: 'mifosx-audit-trails',
  templateUrl: './audit-trails.component.html',
  styleUrls: ['./audit-trails.component.scss'],
})
export class AuditTrailsComponent implements OnInit, AfterViewInit {
  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();
  /** Audit Trails Data */
  auditTrailsData: any;
  /** Filtered user data for autocomplete. */
  filteredUserData: any;
  /** Filtered action data for autocomplete. */
  filteredActionData: any;
  /** Filtered entity data for autocomplete. */
  filteredEntityData: any;
  /** Filtered checker data for autocomplete. */
  filteredCheckerData: any;
  /** Audit Trail Search Template Data. */
  auditTrailSearchTemplateData: any;
  /** Columns to be displayed in audit trails table. */
  displayedColumns: string[] = [
    'id',
    'resourceId',
    'processingResult',
    'maker',
    'actionName',
    'entityName',
    'officeName',
    'madeOnDate',
    'checker',
    'checkedOnDate',
  ];
  /** Data source for audit trails table. */
  dataSource: AuditTrailsDataSource;
  /** Audit Trails filter. */
  filterAuditTrailsBy = [
    {
      type: 'actionName',
      value: '',
    },
    {
      type: 'entityName',
      value: '',
    },
    {
      type: 'resourceId',
      value: '',
    },
    {
      type: 'makerId',
      value: '',
    },
    {
      type: 'makerDateTimeFrom',
      value: '',
    },
    {
      type: 'makerDateTimeTo',
      value: '',
    },
    {
      type: 'checkerDateTimeFrom',
      value: '',
    },
    {
      type: 'checkerDateTimeTo',
      value: '',
    },
    {
      type: 'checkerId',
      value: '',
    },
    {
      type: 'processingResult',
      value: '',
    },
    {
      type: 'dateFormat',
      value: 'yyyy-MM-dd',
    },
    {
      type: 'locale',
      value: 'en',
    },
  ];
  /** User form control. */
  user = new UntypedFormControl('');
  /** From date form control. */
  fromDate = new UntypedFormControl();
  /** Checked from date form control. */
  checkedFromDate = new UntypedFormControl();
  /** Processing result form control. */
  processingResult = new UntypedFormControl();
  /** Action name form control. */
  actionName = new UntypedFormControl();
  /** Resource ID form control. */
  resourceId = new UntypedFormControl('');
  /** To date form control. */
  toDate = new UntypedFormControl();
  /** Checked to date form control. */
  checkedToDate = new UntypedFormControl();
  /** Entity name form control. */
  entityName = new UntypedFormControl();
  /** Checker form control. */
  checker = new UntypedFormControl();

  /** Paginator for audit trails table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for audit trails table. */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Retrieves the audit trail search template data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   * @param {SystemService} systemService System Service.
   * @param {DatePipe} datePipe Date Pipe.
   * @param {MatomoService} matomoService Matomo Analytics Service.
   */
  constructor(
    private route: ActivatedRoute,
    private systemService: SystemService,
    private datePipe: DatePipe,
    private matomoService: MatomoService
  ) {
    this.route.data.subscribe((data: { auditTrailSearchTemplate: any }) => {
      this.auditTrailSearchTemplateData = data.auditTrailSearchTemplate;
    });
  }

  /**
   * Sets filtered users, actions and entities for autocomplete and audit trails table.
   */
  ngOnInit() {
    // Track page view and setup analytics
    this.trackPageView();
    this.setupAnalytics();

    this.setFilteredUsers();
    this.setFilteredActions();
    this.setFilteredEntities();
    this.setFilteredCheckers();
    this.getAuditTrails();
  }

  /**
   * Subscribes to all search filters:
   * User Name, From Date, To Date, Checked From Date, Checked To Date, Resource ID, Action Name, Entity Name, Checker
   * sort change and page change.
   */
  ngAfterViewInit() {
    this.user.valueChanges
      .pipe(
        map((value) => (value.id ? value.id : '')),
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.onUserSelection(filterValue);
          this.applyFilter(filterValue, 'makerId');
        })
      )
      .subscribe();

    this.fromDate.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.onDateRangeFilter('From', filterValue);
          this.applyFilter(this.getDate(filterValue), 'makerDateTimeFrom');
        })
      )
      .subscribe();

    this.toDate.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.onDateRangeFilter('To', filterValue);
          this.applyFilter(this.getDate(filterValue), 'makerDateTimeTo');
        })
      )
      .subscribe();

    this.checkedFromDate.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.onDateRangeFilter('CheckedFrom', filterValue);
          this.applyFilter(this.getDate(filterValue), 'checkerDateTimeFrom');
        })
      )
      .subscribe();

    this.checkedToDate.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.onDateRangeFilter('CheckedTo', filterValue);
          this.applyFilter(this.getDate(filterValue), 'checkerDateTimeTo');
        })
      )
      .subscribe();

    this.resourceId.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.onResourceIdFilter(filterValue);
          this.applyFilter(filterValue, 'resourceId');
        })
      )
      .subscribe();

    this.actionName.valueChanges
      .pipe(
        map((value) => (value ? value : '')),
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.onActionNameFilter(filterValue);
          this.applyFilter(filterValue, 'actionName');
        })
      )
      .subscribe();

    this.entityName.valueChanges
      .pipe(
        map((value) => (value ? value : '')),
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.onEntityNameFilter(filterValue);
          this.applyFilter(filterValue, 'entityName');
        })
      )
      .subscribe();

    this.checker.valueChanges
      .pipe(
        map((value) => (value ? value : '')),
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.onCheckerSelection(filterValue);
          this.applyFilter(filterValue, 'checkerId');
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.onTableSort(this.sort.active, this.sort.direction);
    });

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.onPaginationChange(
            this.paginator.pageIndex,
            this.paginator.pageSize
          );
          this.loadAuditTrailsPage();
        })
      )
      .subscribe();
  }

  /**
   * Initializes the data source for audit trails table and loads the first page.
   */
  getAuditTrails() {
    this.dataSource = new AuditTrailsDataSource(this.systemService);
    this.dataSource.getAuditTrails(this.filterAuditTrailsBy);
  }

  /**
   * Loads a page of audit trails.
   */
  loadAuditTrailsPage() {
    if (!this.sort.direction) {
      delete this.sort.active;
    }
    this.dataSource.getAuditTrails(
      this.filterAuditTrailsBy,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }

  /**
   * Filters data in audit trails table based on passed value and poperty.
   * @param {string} filterValue Value to filter data.
   * @param {string} property Property to filter data by.
   */
  applyFilter(filterValue: string, property: string) {
    // Track filter application
    this.onFilterApplied(property, filterValue);

    this.paginator.pageIndex = 0;
    const findIndex = this.filterAuditTrailsBy.findIndex(
      (filter) => filter.type === property
    );
    this.filterAuditTrailsBy[findIndex].value = filterValue;
    this.loadAuditTrailsPage();
  }

  /**
   * Displays user name in form control input.
   * @param {any} user User data.
   * @returns {string} User name if valid otherwise undefined.
   */
  displayUserName(user?: any): string | undefined {
    return user ? user.name : undefined;
  }

  /**
   * Displays action name in form control input.
   * @param {any} action Action data.
   * @returns {string} Action name if valid otherwise undefined.
   */
  displayActionName(action?: any): string | undefined {
    return action ? action : undefined;
  }

  /**
   * Displays entity name in form control input.
   * @param {any} entity Entity data.
   * @returns {string} Entity name if valid otherwise undefined.
   */
  displayEntityName(entity?: any): string | undefined {
    return entity ? entity : undefined;
  }

  /**
   * Sets filtered users for autocomplete.
   */
  setFilteredUsers() {
    this.filteredUserData = this.user.valueChanges.pipe(
      startWith(''),
      map((user: any) => (typeof user === 'string' ? user : user.name)),
      map((userName: string) =>
        userName
          ? this.filterUserAutocompleteData(userName)
          : this.auditTrailSearchTemplateData.appUsers
      )
    );
  }

  /**
   * Sets filtered checkers for autocomplete.
   */
  setFilteredCheckers() {
    this.filteredCheckerData = this.checker.valueChanges.pipe(
      startWith(''),
      map((user: any) => (typeof user === 'string' ? user : user.name)),
      map((userName: string) =>
        userName
          ? this.filterUserAutocompleteData(userName)
          : this.auditTrailSearchTemplateData.appUsers
      )
    );
  }

  /**
   * Sets filtered actions for autocomplete.
   */
  setFilteredActions() {
    this.filteredActionData = this.actionName.valueChanges.pipe(
      startWith(''),
      map((action: any) => (typeof action === 'string' ? action : '')),
      map((actionName: string) =>
        actionName
          ? this.filterActionAutocompleteData(actionName)
          : this.auditTrailSearchTemplateData.actionNames
      )
    );
  }

  /**
   * Sets filtered entities for autocomplete.
   */
  setFilteredEntities() {
    this.filteredEntityData = this.entityName.valueChanges.pipe(
      startWith(''),
      map((entity: any) => (typeof entity === 'string' ? entity : '')),
      map((entityName: string) =>
        entityName
          ? this.filterEntityAutocompleteData(entityName)
          : this.auditTrailSearchTemplateData.entityNames
      )
    );
  }

  /**
   * Filters users.
   * @param {string} userName User name to filter user by.
   * @returns {any} Filtered users.
   */
  private filterUserAutocompleteData(userName: string): any {
    return this.auditTrailSearchTemplateData.appUsers.filter((user: any) =>
      user.username.toLowerCase().includes(userName.toLowerCase())
    );
  }

  /**
   * Filters actions.
   * @param {string} actionName Action name to filter action by.
   * @returns {any} Filtered actions.
   */
  private filterActionAutocompleteData(actionName: string): any {
    return this.auditTrailSearchTemplateData.actionNames.filter((action: any) =>
      action.toLowerCase().includes(actionName.toLowerCase())
    );
  }

  /**
   * Filters entities.
   * @param {string} entityName Entity name to filter action by.
   * @returns {any} Filtered entities.
   */
  private filterEntityAutocompleteData(entityName: string): any {
    return this.auditTrailSearchTemplateData.entityNames.filter(
      (entity: any) =>
        entity && entity.toLowerCase().includes(entityName.toLowerCase())
    );
  }

  /**
   * Generates the CSV file of Audit Trails Data.
   */
  downloadCSV() {
    // Track CSV download
    this.onCSVDownload();

    const dateFormat = 'yyyy-MM-dd';
    const replacer = (key: any, value: any) =>
      value === undefined ? '' : value;
    const header = [
      'ID',
      'Resource ID',
      'Status',
      'Office',
      'Made On',
      'Maker',
      'Checked On',
      'Checker',
      'Entity',
      'Action',
      'Client',
    ];
    const headerCode = [
      'id',
      'resourceId',
      'processingResult',
      'officeName',
      'madeOnDate',
      'maker',
      'checkedOnDate',
      'checker',
      'entityName',
      'actionName',
      'clientName',
    ];
    this.systemService
      .getAuditTrails(
        this.filterAuditTrailsBy,
        this.sort.active ? this.sort.active : '',
        this.sort.direction,
        0,
        10
      )
      .subscribe((response: any) => {
        if (response !== undefined) {
          let csv = response.content.map((row: any) =>
            headerCode.map((fieldName) =>
              (fieldName === 'madeOnDate' || fieldName === 'checkedOnDate') &&
              JSON.stringify(row[fieldName], replacer) !== '""'
                ? this.datePipe.transform(row[fieldName], dateFormat)
                : JSON.stringify(row[fieldName], replacer)
            )
          );
          csv.unshift(`data:text/csv;charset=utf-8,${header.join()}`);
          csv = csv.join('\r\n');
          const link = document.createElement('a');
          link.setAttribute('href', encodeURI(csv));
          link.setAttribute('download', 'Audit Trails.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Track successful CSV export
          this.matomoService.trackEvent(
            'Export',
            'CSV Success',
            `Records: ${response.content.length}`,
            response.content.length
          );
        }
      });
  }

  /**
   * Gets the date from the passed timestamp.
   *
   * TODO: Update once language and date settings are setup.
   *
   * @param {any} timestamp Timestamp from which date is to be extracted.
   */
  private getDate(timestamp: any) {
    const dateFormat = 'yyyy-MM-dd';
    return this.datePipe.transform(timestamp, dateFormat);
  }

  /**
   * Track page view for audit trails listing
   */
  trackPageView(): void {
    this.matomoService.trackPageView('Audit Trails', '/system/audit-trails');
  }

  /**
   * Setup initial analytics configuration
   */
  setupAnalytics(): void {
    this.matomoService.trackEvent('Page', 'Loaded', 'Audit Trails', 1);
    this.trackBusinessMetric('audit_trails_page_loaded', 1, 'views');

    // Track template data availability
    if (this.auditTrailSearchTemplateData) {
      this.trackSearchTemplateMetrics();
    }
  }

  /**
   * Track search template metrics for business intelligence
   */
  trackSearchTemplateMetrics(): void {
    const templateData = this.auditTrailSearchTemplateData;

    // Track available filter options
    if (templateData.appUsers) {
      this.matomoService.trackEvent(
        'Template',
        'Users Available',
        'Audit Trails',
        templateData.appUsers.length
      );
    }

    if (templateData.actionNames) {
      this.matomoService.trackEvent(
        'Template',
        'Actions Available',
        'Audit Trails',
        templateData.actionNames.length
      );
    }

    if (templateData.entityNames) {
      this.matomoService.trackEvent(
        'Template',
        'Entities Available',
        'Audit Trails',
        templateData.entityNames.length
      );
    }

    this.trackBusinessMetric('search_template_loaded', 1, 'templates');
  }

  /**
   * Track filter usage with detailed analytics
   */
  onFilterApplied(filterType: string, filterValue: any): void {
    this.matomoService.trackEvent(
      'Filter',
      'Applied',
      `Audit Trails - ${filterType}`,
      1
    );
    this.trackBusinessMetric(
      `filter_${filterType.toLowerCase()}_usage`,
      1,
      'filters'
    );

    // Track specific filter patterns
    if (filterValue && filterValue !== '') {
      this.matomoService.trackEvent(
        'Filter',
        'Value Set',
        `${filterType}: ${String(filterValue).substring(0, 50)}`,
        1
      );
    }
  }

  /**
   * Track resource ID filter usage
   */
  onResourceIdFilter(value: string): void {
    this.matomoService.trackEvent('Filter', 'Resource ID', 'Audit Trails', 1);
    this.trackBusinessMetric('resource_id_filter_usage', 1, 'filters');
    this.onFilterApplied('resourceId', value);
  }

  /**
   * Track user selection in autocomplete
   */
  onUserSelection(user: any): void {
    this.matomoService.trackEvent('Filter', 'User Selected', 'Audit Trails', 1);
    this.trackBusinessMetric('user_filter_usage', 1, 'filters');

    if (user && user.name) {
      this.matomoService.trackEvent(
        'Filter',
        'User Type',
        `User: ${user.name}`,
        1
      );
    }
  }

  /**
   * Track action name filter usage
   */
  onActionNameFilter(action: string): void {
    this.matomoService.trackEvent('Filter', 'Action Name', 'Audit Trails', 1);
    this.trackBusinessMetric('action_filter_usage', 1, 'filters');
    this.onFilterApplied('actionName', action);
  }

  /**
   * Track entity name filter usage
   */
  onEntityNameFilter(entity: string): void {
    this.matomoService.trackEvent('Filter', 'Entity Name', 'Audit Trails', 1);
    this.trackBusinessMetric('entity_filter_usage', 1, 'filters');
    this.onFilterApplied('entityName', entity);
  }

  /**
   * Track checker selection
   */
  onCheckerSelection(checker: any): void {
    this.matomoService.trackEvent(
      'Filter',
      'Checker Selected',
      'Audit Trails',
      1
    );
    this.trackBusinessMetric('checker_filter_usage', 1, 'filters');

    if (checker && checker.name) {
      this.matomoService.trackEvent(
        'Filter',
        'Checker Type',
        `Checker: ${checker.name}`,
        1
      );
    }
  }

  /**
   * Track date range filtering
   */
  onDateRangeFilter(dateType: string, date: any): void {
    this.matomoService.trackEvent(
      'Filter',
      `Date ${dateType}`,
      'Audit Trails',
      1
    );
    this.trackBusinessMetric(
      `date_${dateType.toLowerCase()}_filter_usage`,
      1,
      'filters'
    );

    if (date) {
      this.matomoService.trackEvent(
        'Filter',
        'Date Range Usage',
        `${dateType} Date Set`,
        1
      );
    }
  }

  /**
   * Track processing result filter
   */
  onProcessingResultFilter(result: string): void {
    this.matomoService.trackEvent(
      'Filter',
      'Processing Result',
      'Audit Trails',
      1
    );
    this.trackBusinessMetric('processing_result_filter_usage', 1, 'filters');
    this.onFilterApplied('processingResult', result);
  }

  /**
   * Track CSV download actions
   */
  onCSVDownload(): void {
    this.matomoService.trackEvent('Export', 'CSV Download', 'Audit Trails', 1);
    this.trackBusinessMetric('csv_downloads', 1, 'exports');

    // Track current filter state for download context
    const activeFilters = this.filterAuditTrailsBy.filter(
      (filter) => filter.value && filter.value !== ''
    );
    this.matomoService.trackEvent(
      'Export',
      'Filtered CSV',
      `Filters Applied: ${activeFilters.length}`,
      1
    );
  }

  /**
   * Track table sorting interactions
   */
  onTableSort(column: string, direction: string): void {
    this.matomoService.trackEvent(
      'Table',
      'Sort',
      `Audit Trails - ${column}`,
      1
    );
    this.trackBusinessMetric('table_sort_interactions', 1, 'sorts');

    if (direction) {
      this.matomoService.trackEvent(
        'Table',
        'Sort Direction',
        `${column} - ${direction}`,
        1
      );
    }
  }

  /**
   * Track pagination interactions
   */
  onPaginationChange(pageIndex: number, pageSize: number): void {
    this.matomoService.trackEvent('Table', 'Pagination', 'Audit Trails', 1);
    this.trackBusinessMetric('pagination_interactions', 1, 'pages');

    this.matomoService.trackEvent('Table', 'Page Size', `Size: ${pageSize}`, 1);
    this.matomoService.trackEvent(
      'Table',
      'Page Index',
      `Index: ${pageIndex}`,
      1
    );
  }

  /**
   * Track audit trail row clicks
   */
  onAuditTrailClick(auditTrail: any): void {
    this.matomoService.trackEvent(
      'Navigation',
      'Audit Trail View',
      'Audit Trails',
      1
    );
    this.trackBusinessMetric('audit_trail_views', 1, 'views');

    if (auditTrail) {
      this.matomoService.trackEvent(
        'Navigation',
        'Trail ID',
        `ID: ${auditTrail.id}`,
        1
      );

      if (auditTrail.actionName) {
        this.matomoService.trackEvent(
          'Navigation',
          'Trail Action',
          `Action: ${auditTrail.actionName}`,
          1
        );
      }

      if (auditTrail.entityName) {
        this.matomoService.trackEvent(
          'Navigation',
          'Trail Entity',
          `Entity: ${auditTrail.entityName}`,
          1
        );
      }
    }
  }

  /**
   * Track autocomplete interactions
   */
  onAutocompleteInteraction(type: string, searchTerm: string): void {
    this.matomoService.trackEvent('Autocomplete', type, 'Audit Trails', 1);
    this.trackBusinessMetric(
      `autocomplete_${type.toLowerCase()}_usage`,
      1,
      'interactions'
    );

    if (searchTerm && searchTerm.length > 2) {
      this.matomoService.trackEvent(
        'Autocomplete',
        'Search Pattern',
        `${type}: ${searchTerm.substring(0, 20)}`,
        1
      );
    }
  }

  /**
   * Track performance metrics
   */
  trackPerformanceMetric(metricName: string, value: number): void {
    this.matomoService.trackEvent(
      'Performance',
      metricName,
      'Audit Trails',
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
