import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiariesComponent } from './beneficiaries.component';

describe('BeneficiariesComponent', () => {
  let component: BeneficiariesComponent;
  let fixture: ComponentFixture<BeneficiariesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BeneficiariesComponent]
    });
    fixture = TestBed.createComponent(BeneficiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
