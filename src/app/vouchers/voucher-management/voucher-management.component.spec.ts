import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherManagementComponent } from './voucher-management.component';

describe('VoucherManagementComponent', () => {
  let component: VoucherManagementComponent;
  let fixture: ComponentFixture<VoucherManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoucherManagementComponent]
    });
    fixture = TestBed.createComponent(VoucherManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
