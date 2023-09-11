import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmnDialogComponent } from './bpmn-dialog.component';

describe('BpmnDialogComponent', () => {
  let component: BpmnDialogComponent;
  let fixture: ComponentFixture<BpmnDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmnDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmnDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
