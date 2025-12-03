import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSelectorComponent } from './filter-selector.component';

describe('FilterSelectorComponent', () => {
  let component: FilterSelectorComponent;
  let fixture: ComponentFixture<FilterSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterSelectorComponent]
    });
    fixture = TestBed.createComponent(FilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
