import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequestToPayComponent } from './view-request-to-pay.component';

describe('ViewRequestToPayComponent', () => {
  let component: ViewRequestToPayComponent;
  let fixture: ComponentFixture<ViewRequestToPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRequestToPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRequestToPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
