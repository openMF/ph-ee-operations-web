/** Angular Imports */
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/** Environment */
import { environment } from 'environments/environment';

/**
 * Visualizations Component
 */
@Component({
  selector: 'mifosx-visualizations',
  templateUrl: './visualizations.component.html',
  styleUrls: ['./visualizations.component.scss']
})
export class VisualizationsComponent {
  grafanaUrl: SafeResourceUrl;

  /** Grafana filter */
  filter: string= '?orgId=1&refresh=5s&theme=light&kiosk=tv&fullscreen=true&refresh=5s&from=now-5m&to=now';

  constructor(private sanitizer: DomSanitizer) { }

  /** Initialize the Grafana URL with the filter by using sanitizer */
  ngOnInit(): void {
    this.grafanaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.grafana.url+this.filter);
  }
}
