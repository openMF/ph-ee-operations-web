import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingTransactionsComponent } from './incoming-transactions.component';

describe('TransactionsComponent', () => {
  let component: IncomingTransactionsComponent;
  let fixture: ComponentFixture<IncomingTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncomingTransactionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
