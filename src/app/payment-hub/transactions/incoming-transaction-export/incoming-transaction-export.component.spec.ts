import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingTransactionExportComponent } from './incoming-transaction-export.component';

describe('IncomingTransactionExportComponent', () => {
  let component: IncomingTransactionExportComponent;
  let fixture: ComponentFixture<IncomingTransactionExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomingTransactionExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingTransactionExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
