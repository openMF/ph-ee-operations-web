/** Angular Imports */
import { Component } from '@angular/core';

/** Custom Services */
import { Section } from 'app/payment-hub/filter-selector/section-model';

/**
 * Home component.
 */
@Component({
  selector: 'mifosx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  sections: Section[];

  constructor() {
    this.sections = [
      {
        label: 'Payment Hub',
        routeTo: ['paymenthub'],
        roleName: 'operations',
        icon: 'money-bill-alt',
        active: false,
        disabled: false
      },
      {
        label: 'Vouchers',
        routeTo: ['vouchers'],
        roleName: 'vouchers',
        icon: 'ticket',
        active: false,
        disabled: false
      },
      {
        label: 'Account Management',
        routeTo: ['account-mapper'],
        roleName: 'account-mapper',
        icon: 'users',
        active: false,
        disabled: false
      }
    ];
  }

}
