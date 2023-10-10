import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchersSectionFilterComponent } from './vouchers-section-filter.component';

describe('VouchersSectionFilterComponent', () => {
  let component: VouchersSectionFilterComponent;
  let fixture: ComponentFixture<VouchersSectionFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VouchersSectionFilterComponent]
    });
    fixture = TestBed.createComponent(VouchersSectionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
