/** Angular Imports */
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ActivatedRoute } from '@angular/router';

/** rxjs Imports */
import { of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** Custom Imports */
import { MatomoService } from '../core/analytics/matomo.service';

/**
 * Users component.
 */
@Component({
  selector: 'mifosx-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  /** Users data. */
  usersData: any;
  /** Columns to be displayed in users table. */
  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'enabled'];
  /** Data source for users table. */
  dataSource: MatTableDataSource<any>;

  /** Paginator for users table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for users table. */
  @ViewChild(MatSort) sort: MatSort;

  /** Subject for component destruction */
  private destroy$ = new Subject<void>();

  /**
   * Retrieves the users data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   * @param {MatomoService} matomoService Matomo analytics service.
   */
  constructor(
    private route: ActivatedRoute,
    private matomoService: MatomoService
  ) {
    this.route.data.subscribe((data: { users: any }) => {
      this.usersData = data.users;
    });
  }

  /**
   * Filters data in users table based on passed value.
   * @param {string} filterValue Value to filter data.
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.onFilterUsed(filterValue);
  }

  /**
   * Sets the users table.
   */
  ngOnInit() {
    this.setupAnalytics();
    this.setUsers();
    this.trackPageView();
  }

  /**
   * After view init lifecycle hook.
   */
  ngAfterViewInit() {
    // Setup pagination analytics tracking
    if (this.paginator) {
      this.paginator.page.pipe(takeUntil(this.destroy$)).subscribe((event) => {
        this.onPaginationChange(event.pageIndex + 1, event.pageSize);
      });
    }

    // Setup sort analytics tracking
    if (this.sort) {
      this.sort.sortChange.pipe(takeUntil(this.destroy$)).subscribe((event) => {
        this.onTableSort(event.active, event.direction);
      });
    }
  }

  /**
   * Component cleanup.
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initializes the data source, paginator and sorter for users table.
   */
  setUsers() {
    this.dataSource = new MatTableDataSource(this.usersData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // =====================================
  // MATOMO ANALYTICS METHODS
  // =====================================

  /**
   * Sets up Matomo analytics for the users component.
   */
  private setupAnalytics(): void {
    try {
      this.matomoService.setCustomDimension(1, 'Users');
      this.matomoService.setCustomDimension(2, 'UserManagement');
      this.matomoService.setCustomDimension(3, 'UserListing');

      // Track component initialization time
      const initTime = performance.now();
      this.trackPerformanceMetric('component_init_time', initTime);

      // Track business metrics
      this.trackBusinessMetric(
        'total_users_loaded',
        this.usersData?.length || 0
      );
    } catch (error) {
      console.warn('Matomo analytics setup failed:', error);
    }
  }

  /**
   * Tracks page view for users listing.
   */
  private trackPageView(): void {
    try {
      this.matomoService.trackPageView('Users Management - User Listing');

      // Track additional page context
      this.matomoService.trackEvent(
        'Page',
        'View',
        'Users Listing',
        this.usersData?.length || 0
      );

      // Track enabled vs disabled users ratio
      if (this.usersData && this.usersData.length > 0) {
        const enabledUsers = this.usersData.filter(
          (user: any) => user.enabled
        ).length;
        const disabledUsers = this.usersData.length - enabledUsers;
        this.trackBusinessMetric('enabled_users_count', enabledUsers);
        this.trackBusinessMetric('disabled_users_count', disabledUsers);
      }
    } catch (error) {
      console.warn('Matomo page view tracking failed:', error);
    }
  }

  /**
   * Tracks user filter usage.
   * @param {string} filterValue The filter value used.
   */
  private onFilterUsed(filterValue: string): void {
    try {
      if (filterValue && filterValue.trim().length > 0) {
        this.matomoService.trackEvent(
          'Users',
          'Filter',
          'Search',
          filterValue.length
        );
        this.matomoService.trackSiteSearch(
          filterValue,
          'Users',
          this.dataSource.filteredData.length
        );

        // Track filter effectiveness
        const filteredCount = this.dataSource.filteredData.length;
        const totalCount = this.usersData?.length || 0;
        const filterEffectiveness =
          totalCount > 0 ? (filteredCount / totalCount) * 100 : 0;

        this.trackPerformanceMetric(
          'filter_effectiveness',
          filterEffectiveness
        );
        this.trackBusinessMetric('filter_results_count', filteredCount);
      } else {
        this.matomoService.trackEvent('Users', 'Filter', 'Clear');
      }
    } catch (error) {
      console.warn('Matomo filter tracking failed:', error);
    }
  }

  /**
   * Tracks table sorting interactions.
   * @param {string} column The column being sorted.
   * @param {string} direction The sort direction.
   */
  private onTableSort(column: string, direction: string): void {
    try {
      this.matomoService.trackEvent('Users', 'Table', 'Sort', 1);
      this.matomoService.trackEvent(
        'Users',
        'TableSort',
        `${column}-${direction}`
      );

      // Track most popular sort columns
      this.trackBusinessMetric('sort_column_usage', 1);
    } catch (error) {
      console.warn('Matomo table sort tracking failed:', error);
    }
  }

  /**
   * Tracks pagination interactions.
   * @param {number} pageNumber The current page number.
   * @param {number} pageSize The current page size.
   */
  private onPaginationChange(pageNumber: number, pageSize: number): void {
    try {
      this.matomoService.trackEvent(
        'Users',
        'Pagination',
        'Page Change',
        pageNumber
      );
      this.matomoService.trackEvent(
        'Users',
        'Pagination',
        'Page Size',
        pageSize
      );

      // Track pagination patterns
      this.trackBusinessMetric('page_number_accessed', pageNumber);
      this.trackBusinessMetric('page_size_usage', pageSize);
    } catch (error) {
      console.warn('Matomo pagination tracking failed:', error);
    }
  }

  /**
   * Tracks user row clicks for navigation to details.
   * @param {any} user The user object being viewed.
   */
  onUserClick(user: any): void {
    try {
      this.matomoService.trackEvent(
        'Users',
        'Navigation',
        'View Details',
        user.id
      );
      this.matomoService.trackEvent('Users', 'UserInteraction', 'Select');

      // Track user status insights
      const userStatus = user.enabled ? 'enabled' : 'disabled';
      this.trackBusinessMetric('user_detail_view', 1);
      this.matomoService.setCustomDimension(4, userStatus);
    } catch (error) {
      console.warn('Matomo user click tracking failed:', error);
    }
  }

  /**
   * Tracks create user button clicks.
   */
  onCreateUserClick(): void {
    try {
      this.matomoService.trackEvent('Users', 'Action', 'Create User');

      // Track creation context
      const currentUserCount = this.usersData?.length || 0;
      this.trackBusinessMetric('create_user_initiated', 1);
      this.matomoService.setCustomDimension(5, currentUserCount.toString());
    } catch (error) {
      console.warn('Matomo create user tracking failed:', error);
    }
  }

  /**
   * Tracks performance metrics.
   * @param {string} metricName The name of the metric.
   * @param {number} value The metric value.
   */
  private trackPerformanceMetric(metricName: string, value: number): void {
    try {
      this.matomoService.trackPerformance(metricName, value, 'Users');
    } catch (error) {
      console.warn('Matomo performance tracking failed:', error);
    }
  }

  /**
   * Tracks business intelligence metrics.
   * @param {string} metricName The name of the business metric.
   * @param {number} value The metric value.
   */
  private trackBusinessMetric(metricName: string, value: number): void {
    try {
      this.matomoService.trackBusinessMetric(metricName, value);
    } catch (error) {
      console.warn('Matomo business intelligence tracking failed:', error);
    }
  }
}
