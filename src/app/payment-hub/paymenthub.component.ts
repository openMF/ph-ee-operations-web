/** Angular Imports */
import { Component, OnInit } from '@angular/core';

/** Analytics Imports */
import { MatomoService } from '../core/analytics/matomo.service';

/**
 * Payment HUB component.
 */
@Component({
  selector: 'mifosx-paymenthubee',
  templateUrl: './paymenthub.component.html',
  styleUrls: ['./paymenthub.component.scss'],
})
export class PaymentHubComponent implements OnInit {
  constructor(private matomoService: MatomoService) {}

  ngOnInit() {
    this.trackPageView();
    this.setupAnalytics();
  }

  /**
   * Track page view for Payment Hub main page
   */
  private trackPageView(): void {
    try {
      this.matomoService.trackPageView('Payment Hub Dashboard');

      // Set custom dimensions for the Payment Hub context
      this.matomoService.setCustomDimension(1, 'Payment Hub');
      this.matomoService.setCustomDimension(2, 'Dashboard View');

      // Track initial load performance
      const startTime = performance.now();
      setTimeout(() => {
        const loadTime = performance.now() - startTime;
        this.matomoService.trackPerformance('Payment Hub Load', loadTime);
      }, 100);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  /**
   * Setup analytics configuration for Payment Hub
   */
  private setupAnalytics(): void {
    try {
      // Track that user accessed the main Payment Hub page
      this.matomoService.trackEvent(
        'Page View',
        'Payment Hub Dashboard',
        'Main Menu Access'
      );

      // Track business metric - Payment Hub access
      this.matomoService.trackBusinessMetric(
        'payment_hub_access',
        1,
        'page_views'
      );
    } catch (error) {
      console.warn('Analytics setup failed:', error);
    }
  }

  /**
   * Track navigation to specific payment hub sections
   * @param section The section being navigated to
   * @param actionType The type of action (search, export, etc.)
   */
  onNavigateToSection(section: string, actionType: string): void {
    try {
      // Track the navigation event
      this.matomoService.trackEvent(
        'Navigation',
        'Payment Hub Section',
        `${section} - ${actionType}`
      );

      // Set custom dimension for the destination section
      this.matomoService.setCustomDimension(3, section);

      // Track business metrics for section popularity
      this.matomoService.trackBusinessMetric(
        'section_navigation',
        1,
        'navigations'
      );

      // Track user interaction patterns
      this.matomoService.trackEvent(
        'User Journey',
        'Hub Navigation',
        section,
        Date.now() - performance.timeOrigin
      );
    } catch (error) {
      console.warn('Navigation tracking failed:', error);
    }
  }

  /**
   * Track export action initiation
   * @param exportType The type of export being initiated
   */
  onExportAction(exportType: string): void {
    try {
      this.matomoService.trackEvent(
        'Export Action',
        'Export Initiation',
        exportType
      );

      // Track business metric for export usage
      this.matomoService.trackBusinessMetric('export_usage', 1, 'exports');
    } catch (error) {
      console.warn('Export tracking failed:', error);
    }
  }
}
