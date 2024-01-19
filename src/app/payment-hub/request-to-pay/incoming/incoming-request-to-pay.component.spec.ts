import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingRequestToPayComponent } from './incoming-request-to-pay.component';

describe('IncomingRequestToPayComponent', () => {
  let component: IncomingRequestToPayComponent;
  let fixture: ComponentFixture<IncomingRequestToPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingRequestToPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingRequestToPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
