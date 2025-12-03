/** Angular Imports */
import { Component } from '@angular/core';

/** Custom Models */
import { Section } from 'app/payment-hub/filter-selector/section-model';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/**
 * G2P Section Filter Component
 */
@Component({
  selector: 'mifosx-g2p-section-filter',
  templateUrl: './g2p-section-filter.component.html',
  styleUrls: ['./g2p-section-filter.component.scss']
})
export class G2pSectionFilterComponent {
  sections: Section[];

  constructor(private router: Router) { }

  ngOnInit(): void {

    // Define sections for the filter
    this.sections = [
      { label: 'G2P Payment', routeTo: ['dashboard', 'configuration', 'g2p-payment-config'], active: true, disabled: false },
      { label: 'Create', routeTo: ['dashboard', 'configuration', 'create'], active: false, disabled: false },
    ];

    // Subscribe to router events to mark active section
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url.indexOf('/create') > 0) {
        this.markActiveSection('Create');
      } else if (event.url.indexOf('/g2p-payment-config') > 0) {
        this.markActiveSection('G2P Payment');
      }
    });
  }

  /** Set active section */
  setActive(s: Section): void {
    this.markActiveSection(s.label);
  }

  /** Mark active section */
  markActiveSection(name: string): void {
    this.sections.forEach((section: Section) => {
      section.active = false;
      if (section.label === name) {
        section.active = true;
      }
    });
  }


}
