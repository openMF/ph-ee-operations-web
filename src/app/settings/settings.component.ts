/** Angular Imports */
import { Component, OnInit } from '@angular/core';

/** Custom Services */
import { MatomoService } from 'app/core/analytics/matomo.service';

/**
 * Settings component.
 */
@Component({
  selector: 'mifosx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  /** Placeholder for languages. */
  languages: any;
  /** Placeholder for date formats. */
  dateFormats: any;
  /** Placeholder for fonts. */
  fonts: any;

  constructor(private matomoService: MatomoService) {}

  ngOnInit() {
    // Track settings page access
    this.matomoService.trackPageView('Settings');
    this.matomoService.trackEvent(
      'Navigation',
      'Settings Access',
      'Application Settings'
    );
  }

  /**
   * Track language change
   */
  onLanguageChange(language: string): void {
    this.matomoService.trackEvent('Settings', 'Language Change', language);
    this.matomoService.setCustomDimension(4, language); // Assuming dimension 4 for language
  }

  /**
   * Track theme change
   */
  onThemeChange(theme: string): void {
    this.matomoService.trackEvent('Settings', 'Theme Change', theme);
    this.matomoService.setCustomDimension(5, theme); // Assuming dimension 5 for theme
  }

  /**
   * Track analytics opt-out toggle
   */
  onAnalyticsToggle(enabled: boolean): void {
    this.matomoService.trackEvent(
      'Settings',
      'Analytics Toggle',
      enabled ? 'Enabled' : 'Disabled'
    );
    this.matomoService.setTrackingEnabled(enabled);
  }
}
