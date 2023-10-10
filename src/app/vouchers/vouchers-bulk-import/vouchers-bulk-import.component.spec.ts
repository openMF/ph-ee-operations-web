import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchersBulkImportComponent } from './vouchers-bulk-import.component';

describe('VouchersBulkImportComponent', () => {
  let component: VouchersBulkImportComponent;
  let fixture: ComponentFixture<VouchersBulkImportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VouchersBulkImportComponent]
    });
    fixture = TestBed.createComponent(VouchersBulkImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
