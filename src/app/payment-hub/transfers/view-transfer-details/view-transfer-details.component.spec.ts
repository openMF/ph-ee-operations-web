import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransferDetailsComponent } from './view-transfer-details.component';

describe('ViewTransferDetailsComponent', () => {
  let component: ViewTransferDetailsComponent;
  let fixture: ComponentFixture<ViewTransferDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTransferDetailsComponent]
    });
    fixture = TestBed.createComponent(ViewTransferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
