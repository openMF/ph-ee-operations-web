import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingRecallsComponent } from './outgoing-recalls.component';

describe('RecallsComponent', () => {
  let component: OutgoingRecallsComponent;
  let fixture: ComponentFixture<OutgoingRecallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OutgoingRecallsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingRecallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
