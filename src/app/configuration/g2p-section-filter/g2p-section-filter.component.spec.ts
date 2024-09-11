import { ComponentFixture, TestBed } from '@angular/core/testing';

import { G2pSectionFilterComponent } from './g2p-section-filter.component';

describe('G2pSectionFilterComponent', () => {
  let component: G2pSectionFilterComponent;
  let fixture: ComponentFixture<G2pSectionFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [G2pSectionFilterComponent]
    });
    fixture = TestBed.createComponent(G2pSectionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
