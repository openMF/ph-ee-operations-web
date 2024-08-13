import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingIg2FilesComponent } from './incoming-ig2-files.component';

describe('IncomingIg2FilesComponent', () => {
  let component: IncomingIg2FilesComponent;
  let fixture: ComponentFixture<IncomingIg2FilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncomingIg2FilesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingIg2FilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
