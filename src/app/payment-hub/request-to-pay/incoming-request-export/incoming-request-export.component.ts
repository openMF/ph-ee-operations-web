import { Component, OnInit } from '@angular/core';
import { RequestToPayService } from '../service/request-to-pay.service';
import { amsShortCodes } from '../helper/ams-short-codes';
import { MatomoService } from 'app/core/analytics/matomo.service';

@Component({
  selector: 'mifosx-incoming-request-export',
  templateUrl: './incoming-request-export.component.html',
  styleUrls: ['./incoming-request-export.component.scss'],
})
export class IncomingRequestExportComponent implements OnInit {
  amsCodes = amsShortCodes('TILL');
  csvExport: [];
  csvName: string;

  constructor(
    private requestToPayService: RequestToPayService,
    private matomoService: MatomoService
  ) {}

  ngOnInit(): void {
    this.trackPageView();
    this.setupAnalytics();
  }

  /**
   * Track page view for incoming request export
   */
  trackPageView(): void {
    this.matomoService.trackPageView(
      'Incoming Request Export',
      '/payment-hub/request-to-pay/incoming-export'
    );
  }

  /**
   * Setup initial analytics configuration
   */
  setupAnalytics(): void {
    this.matomoService.trackEvent(
      'Page',
      'Loaded',
      'Incoming Request Export',
      1
    );
    this.trackBusinessMetric('request_export_forms_loaded', 1, 'views');
  }

  /**
   * Track filter field interactions
   */
  onFilterUsed(filterType: string, value?: any): void {
    this.matomoService.trackEvent(
      'Filter',
      'Used',
      `Request Export ${filterType}`,
      1
    );

    if (value) {
      this.matomoService.trackEvent(
        'Filter',
        'Value Set',
        `Request Export ${filterType}`,
        1
      );
    }

    this.trackBusinessMetric('filter_interactions', 1, 'interactions');
  }

  /**
   * Track date picker interactions
   */
  onDatePickerUsed(dateType: 'start' | 'end'): void {
    this.matomoService.trackEvent('DatePicker', 'Used', `${dateType} Date`, 1);
    this.trackBusinessMetric('datepicker_usage', 1, 'uses');
  }

  /**
   * Track AMS code selection
   */
  onAmsCodeSelection(selectedCodes: any[]): void {
    this.matomoService.trackEvent(
      'MultiSelect',
      'AMS Codes',
      'Selection',
      selectedCodes.length
    );
    this.trackBusinessMetric(
      'ams_codes_selected',
      selectedCodes.length,
      'codes'
    );
  }

  /**
   * Track form validation states
   */
  onFormValidationChange(isValid: boolean): void {
    const status = isValid ? 'Valid' : 'Invalid';
    this.matomoService.trackEvent(
      'Form',
      'Validation',
      `Request Export Form ${status}`,
      1
    );
  }

  arrayConvert(event: any) {
    const values = event.target.value.split(',');
    this.matomoService.trackEvent(
      'Form',
      'Array Input',
      'Comma Separated Values',
      values.length
    );
    return values;
  }

  /**
   * Enhanced export CSV with comprehensive analytics
   */
  exportCSV(filterBy: any): void {
    const startTime = performance.now();

    // Track export initiation
    this.matomoService.trackEvent(
      'Export',
      'Initiated',
      'Request to Pay CSV Export',
      1
    );

    // Track form data for business intelligence
    this.trackExportFilters(filterBy);

    try {
      this.requestToPayService.exportCSV(filterBy);

      // Track successful export
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      this.matomoService.trackEvent(
        'Export',
        'Success',
        'Request to Pay CSV Export',
        1
      );
      this.trackBusinessMetric('request_csv_exports_completed', 1, 'exports');
      this.trackBusinessMetric('export_duration', duration, 'milliseconds');

      // Track performance metrics
      if (duration > 5000) {
        this.matomoService.trackEvent(
          'Performance',
          'Slow Export',
          'Request to Pay CSV Export',
          duration
        );
      }
    } catch (error) {
      this.matomoService.trackEvent(
        'Export',
        'Error',
        'Request to Pay CSV Export',
        1
      );
      this.trackBusinessMetric('request_export_errors', 1, 'errors');
    }
  }

  /**
   * Track export filter usage for business intelligence
   */
  private trackExportFilters(filterBy: any): void {
    const filterCount = Object.keys(filterBy).filter(
      (key) => filterBy[key] && filterBy[key].toString().trim()
    ).length;

    this.trackBusinessMetric(
      'request_export_filters_used',
      filterCount,
      'filters'
    );

    // Track individual filter usage
    if (filterBy.transactionid) {
      this.matomoService.trackEvent(
        'Filter',
        'Used',
        'Request Transaction ID',
        1
      );
      this.trackBusinessMetric(
        'request_transaction_id_filter_usage',
        1,
        'uses'
      );
    }

    if (filterBy.externalid) {
      this.matomoService.trackEvent('Filter', 'Used', 'Request External ID', 1);
      this.trackBusinessMetric('request_external_id_filter_usage', 1, 'uses');
    }

    if (filterBy.workflowinstancekey) {
      this.matomoService.trackEvent(
        'Filter',
        'Used',
        'Request Workflow Key',
        1
      );
      this.trackBusinessMetric('request_workflow_key_filter_usage', 1, 'uses');
    }

    if (filterBy.startdate) {
      this.matomoService.trackEvent('Filter', 'Used', 'Request Start Date', 1);
      this.trackBusinessMetric('request_start_date_filter_usage', 1, 'uses');
    }

    if (filterBy.enddate) {
      this.matomoService.trackEvent('Filter', 'Used', 'Request End Date', 1);
      this.trackBusinessMetric('request_end_date_filter_usage', 1, 'uses');
    }

    if (filterBy.status) {
      this.matomoService.trackEvent(
        'Filter',
        'Used',
        `Request Status: ${filterBy.status}`,
        1
      );
      this.trackBusinessMetric('request_status_filter_usage', 1, 'uses');
    }

    if (filterBy.errordescription) {
      this.matomoService.trackEvent(
        'Filter',
        'Used',
        'Request Error Description',
        1
      );
      this.trackBusinessMetric('request_error_filter_usage', 1, 'uses');
    }

    if (filterBy.payerid) {
      this.matomoService.trackEvent('Filter', 'Used', 'Request Payer ID', 1);
      this.trackBusinessMetric('request_payer_id_filter_usage', 1, 'uses');
    }

    if (filterBy.payeeid) {
      this.matomoService.trackEvent('Filter', 'Used', 'Request Payee ID', 1);
      this.trackBusinessMetric('request_payee_id_filter_usage', 1, 'uses');
    }

    if (filterBy.payerdfspid) {
      this.matomoService.trackEvent(
        'Filter',
        'Used',
        'Request AMS Business Code',
        1
      );
      this.trackBusinessMetric('request_ams_code_filter_usage', 1, 'uses');

      if (Array.isArray(filterBy.payerdfspid)) {
        this.trackBusinessMetric(
          'request_ams_codes_selected',
          filterBy.payerdfspid.length,
          'codes'
        );
      }
    }
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
