import { ComponentFixture, TestBed } from '@angular/core/testing';

import { G2pProgramComponent } from './g2p-payment.component';

describe('G2pProgramComponent', () => {
  let component: G2pProgramComponent;
  let fixture: ComponentFixture<G2pProgramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [G2pProgramComponent]
    });
    fixture = TestBed.createComponent(G2pProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
