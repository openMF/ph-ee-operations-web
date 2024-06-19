import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchesBulkImportComponent } from './batches-bulk-import.component';

describe('BatchesBulkImportComponent', () => {
  let component: BatchesBulkImportComponent;
  let fixture: ComponentFixture<BatchesBulkImportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BatchesBulkImportComponent]
    });
    fixture = TestBed.createComponent(BatchesBulkImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
