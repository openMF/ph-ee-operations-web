import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationsComponent } from './visualizations.component';

describe('VisualizationsComponent', () => {
  let component: VisualizationsComponent;
  let fixture: ComponentFixture<VisualizationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizationsComponent]
    });
    fixture = TestBed.createComponent(VisualizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
