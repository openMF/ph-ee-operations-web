import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetBatchesExportComponent } from './get-batches-export.component';

describe('GetBatchesExportComponent', () => {
  let component: GetBatchesExportComponent;
  let fixture: ComponentFixture<GetBatchesExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetBatchesExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetBatchesExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
