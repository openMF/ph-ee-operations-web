/** Angular Imports */
import { Component } from '@angular/core';
import { Router } from '@angular/router';

/** Custom Models */
import { Section } from 'app/payment-hub/filter-selector/section-model';

/**
 * Visualizations Selector Component
 *  
 * Contains the visualizations selector component.
 */
@Component({
  selector: 'mifosx-visualizations-selector',
  templateUrl: './visualizations-selector.component.html',
  styleUrls: ['./visualizations-selector.component.scss']
})
export class VisualizationsSelectorComponent {

  sections: Section[];

  constructor() {
    this.sections = [
      {
        label: 'User Management',
        routeTo: ['dashboard','visualizations','user-management'],
        roleName: ['Normal User', 'Admin Maker', 'Admin Checker'],
        icon: 'users',
        active: false,
        disabled: false
      }
    ];
  }
}