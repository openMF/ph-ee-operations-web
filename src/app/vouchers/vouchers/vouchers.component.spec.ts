import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchersComponent } from './vouchers.component';

describe('VouchersComponent', () => {
  let component: VouchersComponent;
  let fixture: ComponentFixture<VouchersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VouchersComponent]
    });
    fixture = TestBed.createComponent(VouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
