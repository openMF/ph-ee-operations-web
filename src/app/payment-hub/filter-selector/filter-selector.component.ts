import { Component, Input, OnInit } from '@angular/core';
import { Section } from './section-model';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'mifosx-filter-selector',
  templateUrl: './filter-selector.component.html',
  styleUrls: ['./filter-selector.component.scss']
})
export class FilterSelectorComponent implements OnInit {

  @Input() currentSection: string;
  sections: Section[];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.sections = [
      {label: 'Main Batches', routeTo: ['paymenthub', 'batches'], active: true},
      {label: 'Create Batch', routeTo: ['paymenthub', 'bulk-import'], active: false},
      {label: 'Sub Batches', routeTo: ['paymenthub', 'sub-batches'], active: false},
      {label: 'Transfers', routeTo: ['paymenthub', 'transfers'], active: false}
    ];

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url.indexOf('/sub-batches') > 0) {
        this.markActiveSection('Sub Batches');
      } else if (event.url.indexOf('/transfers') > 0) {
        this.markActiveSection('Transfers');
      }
    });
  }

  setActive(s: Section): void {
    this.markActiveSection(s.label);
  }

  markActiveSection(name: string): void {
    this.sections.forEach((section: Section) => {
      section.active = false;
      if (section.label === name) {
        section.active = true;
      }
    });
  }
}
