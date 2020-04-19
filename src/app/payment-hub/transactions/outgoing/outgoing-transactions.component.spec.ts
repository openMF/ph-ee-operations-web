import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingTransactionsComponent } from './outgoing-transactions.component';

describe('TransactionsComponent', () => {
  let component: OutgoingTransactionsComponent;
  let fixture: ComponentFixture<OutgoingTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OutgoingTransactionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
