import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubBatchesComponent } from './sub-batches.component';

describe('SubBatchesComponent', () => {
  let component: SubBatchesComponent;
  let fixture: ComponentFixture<SubBatchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubBatchesComponent]
    });
    fixture = TestBed.createComponent(SubBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
