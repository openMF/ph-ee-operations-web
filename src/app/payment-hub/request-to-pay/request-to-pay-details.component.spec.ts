import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestToPayDetailsComponent } from './request-to-pay-details.component';

describe('RequestToPayDetailsComponent', () => {
  let component: RequestToPayDetailsComponent;
  let fixture: ComponentFixture<RequestToPayDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestToPayDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestToPayDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
