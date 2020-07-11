import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingRequestToPayComponent } from './outgoing-request-to-pay.component';

describe('OutgoingRequestToPayComponent', () => {
  let component: OutgoingRequestToPayComponent;
  let fixture: ComponentFixture<OutgoingRequestToPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutgoingRequestToPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingRequestToPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
