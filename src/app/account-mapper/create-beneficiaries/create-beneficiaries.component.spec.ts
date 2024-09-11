import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBeneficiariesComponent } from './create-beneficiaries.component';

describe('CreateBeneficiariesComponent', () => {
  let component: CreateBeneficiariesComponent;
  let fixture: ComponentFixture<CreateBeneficiariesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBeneficiariesComponent]
    });
    fixture = TestBed.createComponent(CreateBeneficiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
