import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateG2pPaymentComponent } from './update-g2p-payment.component';

describe('UpdateG2pPaymentComponent', () => {
  let component: UpdateG2pPaymentComponent;
  let fixture: ComponentFixture<UpdateG2pPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateG2pPaymentComponent]
    });
    fixture = TestBed.createComponent(UpdateG2pPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
