import { Component, OnInit } from '@angular/core';
import { Section } from 'app/payment-hub/filter-selector/section-model';

@Component({
  selector: 'mifosx-vouchers-section-filter',
  templateUrl: './vouchers-section-filter.component.html',
  styleUrls: ['./vouchers-section-filter.component.scss']
})
export class VouchersSectionFilterComponent implements OnInit {

  sections: Section[];

  constructor() { }

  ngOnInit(): void {
    this.sections = [
      { label: 'Vouchers', routeTo: ['vouchers', 'voucher-management'], active: true, disabled: false },
      { label: 'Create Vouchers', routeTo: ['vouchers', 'bulk-import'], active: false, disabled: false },
    ];
  }

  setActive(s: Section): void {
    this.sections.forEach((section: Section) => {
      section.active = false;
      if (section.label === s.label) {
        section.active = true;
      }
    });
  }


}
