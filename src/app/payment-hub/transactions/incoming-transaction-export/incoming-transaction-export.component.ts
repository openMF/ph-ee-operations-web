import { Component, OnInit } from '@angular/core';
import { PaymenthubService } from 'app/payment-hub/paymenthub.service';
import { amsShortCodes } from 'app/payment-hub/request-to-pay/helper/ams-short-codes';
import { MatomoService } from 'app/core/analytics/matomo.service';

@Component({
  selector: 'mifosx-incoming-transaction-export',
  templateUrl: './incoming-transaction-export.component.html',
  styleUrls: ['./incoming-transaction-export.component.scss'],
})
export class IncomingTransactionExportComponent implements OnInit {
  private readonly exportUrl = '/api/v1/transfers/export';
  private readonly fileNamePrefix = 'TRANSFERS';
  amsCodes = amsShortCodes('PAYBILL');

  constructor(
    private paymenthubService: PaymenthubService,
    private matomoService: MatomoService
  ) {}

  ngOnInit(): void {
    this.trackPageView();
    this.setupAnalytics();
  }

  /**
   * Track page view for incoming transaction export
   */
  trackPageView(): void {
    this.matomoService.trackPageView(
      'Incoming Transaction Export',
      '/payment-hub/transactions/incoming-export'
    );
  }

  /**
   * Setup initial analytics configuration
   */
  setupAnalytics(): void {
    this.matomoService.trackEvent(
      'Page',
      'Loaded',
      'Incoming Transaction Export',
      1
    );
    this.trackBusinessMetric('export_forms_loaded', 1, 'views');
  }

  /**
   * Track CSV export action with comprehensive analytics
   */
  exportCSV(filterBy: any): void {
    const startTime = performance.now();

    // Track export initiation
    this.matomoService.trackEvent('Export', 'Initiated', 'CSV Export', 1);

    // Track form data for business intelligence
    this.trackExportFilters(filterBy);

    try {
      this.paymenthubService.exportCSV(
        filterBy,
        this.exportUrl,
        this.fileNamePrefix
      );

      // Track successful export
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      this.matomoService.trackEvent('Export', 'Success', 'CSV Export', 1);
      this.trackBusinessMetric('csv_exports_completed', 1, 'exports');
      this.trackBusinessMetric('export_duration', duration, 'milliseconds');

      // Track performance metrics
      if (duration > 5000) {
        this.matomoService.trackEvent(
          'Performance',
          'Slow Export',
          'CSV Export',
          duration
        );
      }
    } catch (error) {
      this.matomoService.trackEvent('Export', 'Error', 'CSV Export', 1);
      this.trackBusinessMetric('export_errors', 1, 'errors');
    }
  }

  /**
   * Track filter usage for business intelligence
   */
  private trackExportFilters(filterBy: any): void {
    const filterCount = Object.keys(filterBy).filter(
      (key) => filterBy[key] && filterBy[key].toString().trim()
    ).length;

    this.trackBusinessMetric('export_filters_used', filterCount, 'filters');

    // Track individual filter usage
    if (filterBy.transactionid) {
      this.matomoService.trackEvent('Filter', 'Used', 'Transaction ID', 1);
      this.trackBusinessMetric('transaction_id_filter_usage', 1, 'uses');
    }

    if (filterBy.workflowinstancekey) {
      this.matomoService.trackEvent(
        'Filter',
        'Used',
        'Workflow Instance Key',
        1
      );
      this.trackBusinessMetric('workflow_key_filter_usage', 1, 'uses');
    }

    if (filterBy.startdate) {
      this.matomoService.trackEvent('Filter', 'Used', 'Start Date', 1);
      this.trackBusinessMetric('start_date_filter_usage', 1, 'uses');
    }

    if (filterBy.enddate) {
      this.matomoService.trackEvent('Filter', 'Used', 'End Date', 1);
      this.trackBusinessMetric('end_date_filter_usage', 1, 'uses');
    }

    if (filterBy.status) {
      this.matomoService.trackEvent(
        'Filter',
        'Used',
        `Status: ${filterBy.status}`,
        1
      );
      this.trackBusinessMetric('status_filter_usage', 1, 'uses');
    }

    if (filterBy.payerid) {
      this.matomoService.trackEvent('Filter', 'Used', 'Payer ID', 1);
      this.trackBusinessMetric('payer_id_filter_usage', 1, 'uses');
    }

    if (filterBy.payeeid) {
      this.matomoService.trackEvent('Filter', 'Used', 'Payee ID', 1);
      this.trackBusinessMetric('payee_id_filter_usage', 1, 'uses');
    }

    if (filterBy.payerdfspid) {
      this.matomoService.trackEvent('Filter', 'Used', 'AMS Business Code', 1);
      this.trackBusinessMetric('ams_code_filter_usage', 1, 'uses');

      if (Array.isArray(filterBy.payerdfspid)) {
        this.trackBusinessMetric(
          'ams_codes_selected',
          filterBy.payerdfspid.length,
          'codes'
        );
      }
    }
  }

  /**
   * Track form field interactions
   */
  onFilterUsed(filterType: string, value?: any): void {
    this.matomoService.trackEvent(
      'Form',
      'Field Interaction',
      `Export ${filterType}`,
      1
    );

    if (value) {
      this.matomoService.trackEvent(
        'Form',
        'Field Value Set',
        `Export ${filterType}`,
        1
      );
    }
  }

  /**
   * Track datepicker interactions
   */
  onDatePickerUsed(dateType: 'start' | 'end'): void {
    this.matomoService.trackEvent('Form', 'Date Picker', `${dateType} Date`, 1);
    this.trackBusinessMetric('datepicker_usage', 1, 'uses');
  }

  /**
   * Track AMS code selection
   */
  onAmsCodeSelection(selectedCodes: any[]): void {
    this.matomoService.trackEvent(
      'Form',
      'Multi Select',
      'AMS Codes',
      selectedCodes.length
    );
    this.trackBusinessMetric(
      'ams_codes_selected',
      selectedCodes.length,
      'codes'
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

  /**
   * Track form validation states
   */
  onFormValidationChange(isValid: boolean): void {
    const status = isValid ? 'Valid' : 'Invalid';
    this.matomoService.trackEvent(
      'Form',
      'Validation',
      `Export Form ${status}`,
      1
    );
  }
}
