import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingIg2FilesComponent } from './outgoing-ig2-files.component';

describe('OutgoingIg2FilesComponent', () => {
  let component: OutgoingIg2FilesComponent;
  let fixture: ComponentFixture<OutgoingIg2FilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OutgoingIg2FilesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingIg2FilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
