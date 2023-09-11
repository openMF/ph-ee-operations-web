import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingRecallsComponent } from './incoming-recalls.component';

describe('RecallsComponent', () => {
  let component: IncomingRecallsComponent;
  let fixture: ComponentFixture<IncomingRecallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncomingRecallsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingRecallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
