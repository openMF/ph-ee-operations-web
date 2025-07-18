/** Angular Imports */
import { Injectable } from "@angular/core";

/** Matomo Imports */
import { MatomoTracker } from "@ngx-matomo/tracker";

/** Environment Configuration */
import { environment } from "environments/environment";

/** Logger Service */
import { Logger } from "../logger/logger.service";

/** Initialize Logger */
const log = new Logger("MatomoService");

/**
 * Matomo Analytics Service
 *
 * Centralized service for handling Matomo analytics tracking
 */
@Injectable({
  providedIn: "root",
})
export class MatomoService {
  constructor(private matomoTracker: MatomoTracker) {

  }

  /**
   * Track a page view
   * @param url The URL to track
   * @param title Optional page title
   */
  trackPageView(url?: string, title?: string): void {
    if (environment.matomo.disabled) {

      return;
    }

    try {
      if (url && title) {
        this.matomoTracker.setCustomUrl(url);
        this.matomoTracker.setDocumentTitle(title);
      }
      this.matomoTracker.trackPageView();

    } catch (error) {
      log.error("Error tracking page view:", error);
    }
  }

  /**
   * Track a custom event
   * @param category Event category
   * @param action Event action
   * @param name Optional event name
   * @param value Optional event value
   */
  trackEvent(
    category: string,
    action: string,
    name?: string,
    value?: number
  ): void {
    if (environment.matomo.disabled) {

      return;
    }

    try {
      this.matomoTracker.trackEvent(category, action, name, value);

    } catch (error) {
      log.error("Error tracking event:", error);
    }
  }

  /**
   * Track user login
   * @param userId User ID
   */
  trackLogin(userId: string): void {
    if (environment.matomo.disabled) {
      return;
    }

    try {
      this.matomoTracker.setUserId(userId);
      this.trackEvent("Authentication", "Login", "User Login");
     
    } catch (error) {
      log.error("Error tracking login:", error);
    }
  }

  /**
   * Track user logout
   */
  trackLogout(): void {
    if (environment.matomo.disabled) {
      return;
    }

    try {
      this.trackEvent("Authentication", "Logout", "User Logout");
      this.matomoTracker.resetUserId();
     
    } catch (error) {
      log.error("Error tracking logout:", error);
    }
  }

  /**
   * Track form submissions
   * @param formName Name of the form
   * @param success Whether the submission was successful
   */
  trackFormSubmission(formName: string, success: boolean): void {
    if (environment.matomo.disabled) {
      return;
    }

    try {
      const action = success ? "Submit Success" : "Submit Error";
      this.trackEvent("Forms", action, formName);
     
    } catch (error) {
      log.error("Error tracking form submission:", error);
    }
  }

  /**
   * Track custom dimensions
   * @param dimensionId Custom dimension ID
   * @param value Custom dimension value
   */
  setCustomDimension(dimensionId: number, value: string): void {
    if (environment.matomo.disabled) {
      return;
    }

    try {
      this.matomoTracker.setCustomDimension(dimensionId, value);
     
    } catch (error) {
      log.error("Error setting custom dimension:", error);
    }
  }

  /**
   * Track search queries
   * @param query Search query
   * @param category Search category
   * @param resultsCount Number of results
   */
  trackSiteSearch(
    query: string,
    category?: string,
    resultsCount?: number
  ): void {
    if (environment.matomo.disabled) {
      return;
    }

    try {
      this.matomoTracker.trackSiteSearch(query, category, resultsCount);
     
    } catch (error) {
      log.error("Error tracking site search:", error);
    }
  }

  /**
   * Track downloads
   * @param downloadUrl URL of the downloaded file
   */
  trackDownload(downloadUrl: string): void {
    if (environment.matomo.disabled) {
      return;
    }

    try {
      this.matomoTracker.trackLink(downloadUrl, "download");
    
    } catch (error) {
      log.error("Error tracking download:", error);
    }
  }

  /**
   * Track outbound links
   * @param linkUrl URL of the external link
   */
  trackOutboundLink(linkUrl: string): void {
    if (environment.matomo.disabled) {
      return;
    }

    try {
      this.matomoTracker.trackLink(linkUrl, "link");
    
    } catch (error) {
      log.error("Error tracking outbound link:", error);
    }
  }

  /**
   * Set user variables for tracking
   * @param userId User ID
   * @param userRole User role
   * @param tenant User tenant
   */
  setUserContext(userId: string, userRole?: string, tenant?: string): void {
    if (environment.matomo.disabled) {
      return;
    }

    try {
      this.matomoTracker.setUserId(userId);

      if (userRole) {
        this.setCustomDimension(1, userRole); // Assuming dimension 1 is for user role
      }

      if (tenant) {
        this.setCustomDimension(2, tenant); // Assuming dimension 2 is for tenant
      }

  
    } catch (error) {
      log.error("Error setting user context:", error);
    }
  }

  /**
   * Track application errors
   * @param error Error object or message
   * @param component Component where error occurred
   * @param severity Error severity level
   */
  trackError(
    error: any,
    component?: string,
    severity: "low" | "medium" | "high" = "medium"
  ): void {
    if (environment.matomo.disabled) {
      return;
    }

    try {
      const errorMessage =
        error?.message || error?.toString() || "Unknown error";
      const action = `${severity.toUpperCase()} Error`;
      const name = component ? `${component}: ${errorMessage}` : errorMessage;

      this.trackEvent("Errors", action, name);
      this.setCustomDimension(3, severity); // Assuming dimension 3 is for error severity

      
    } catch (trackingError) {
      log.error("Error tracking error:", trackingError);
    }
  }

  /**
   * Track performance metrics
   * @param metric Performance metric name
   * @param value Metric value in milliseconds
   * @param category Performance category
   */
  trackPerformance(
    metric: string,
    value: number,
    category: string = "Performance"
  ): void {
    if (environment.matomo.disabled) {
      return;
    }

    try {
      this.trackEvent(category, metric, `${value}ms`, value);
     
    } catch (error) {
      log.error("Error tracking performance:", error);
    }
  }

  /**
   * Track business metrics
   * @param metric Business metric name
   * @param value Metric value
   * @param unit Unit of measurement
   */
  trackBusinessMetric(
    metric: string,
    value: number,
    unit: string = "count"
  ): void {
    if (environment.matomo.disabled) {
      return;
    }

    try {
      this.trackEvent("Business Metrics", metric, `${value} ${unit}`, value);
   
    } catch (error) {
      log.error("Error tracking business metric:", error);
    }
  }

  /**
   * Enable or disable tracking
   * @param enabled Whether tracking should be enabled
   */
  setTrackingEnabled(enabled: boolean): void {
    try {
      if (enabled) {
        this.matomoTracker.setDoNotTrack(false);
      } else {
        this.matomoTracker.setDoNotTrack(true);
      }
      
    } catch (error) {
      log.error("Error changing tracking status:", error);
    }
  }

  /**
   * Check if tracking is currently enabled
   * @returns Whether tracking is enabled
   */
  isTrackingEnabled(): boolean {
    try {
      // Since we can't directly check the opt-out status in this version,
      // we return the inverse of the environment disabled flag
      return !environment.matomo.disabled;
    } catch (error) {
      log.error("Error checking tracking status:", error);
      return false;
    }
  }
}
