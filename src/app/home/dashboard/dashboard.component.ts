/** Angular Imports */
import { Component, OnInit } from '@angular/core';

/** Custom Services */
import { MatomoService } from 'app/core/analytics/matomo.service';

/**
 * Dashboard component.
 */
@Component({
  selector: 'mifosx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private matomoService: MatomoService) {}

  ngOnInit() {
    // Track dashboard page view
    this.matomoService.trackPageView('Dashboard');
    this.matomoService.trackEvent(
      'Navigation',
      'Dashboard Access',
      'Main Dashboard'
    );
  }
}
