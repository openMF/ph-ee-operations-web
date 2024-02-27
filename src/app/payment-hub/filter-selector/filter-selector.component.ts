import { Component, OnInit } from '@angular/core';
import { Section } from './section-model';

@Component({
  selector: 'mifosx-filter-selector',
  templateUrl: './filter-selector.component.html',
  styleUrls: ['./filter-selector.component.scss']
})
export class FilterSelectorComponent implements OnInit {

  sections: Section[];

  constructor() { }

  ngOnInit(): void {
    this.sections = [
      {label: 'Main Batches', routeTo: ['paymenthub', 'batches'], active: true},
      {label: 'Create Batch', routeTo: ['paymenthub', 'bulk-import'], active: false},
      {label: 'Sub Batches', routeTo: ['paymenthub', 'sub-batches'], active: false},
      {label: 'Transfers', routeTo: ['paymenthub', 'transfers'], active: false}
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
