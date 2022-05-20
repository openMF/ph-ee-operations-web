import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingRequestExportComponent } from './incoming-request-export.component';

describe('IncomingRequestExportComponent', () => {
  let component: IncomingRequestExportComponent;
  let fixture: ComponentFixture<IncomingRequestExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomingRequestExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingRequestExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
