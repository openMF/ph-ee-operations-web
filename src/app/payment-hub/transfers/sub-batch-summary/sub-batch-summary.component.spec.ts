import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubBatchSummaryComponent } from './sub-batch-summary.component';

describe('SubBatchSummaryComponent', () => {
  let component: SubBatchSummaryComponent;
  let fixture: ComponentFixture<SubBatchSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubBatchSummaryComponent]
    });
    fixture = TestBed.createComponent(SubBatchSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
