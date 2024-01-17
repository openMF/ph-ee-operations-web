import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionDataSelectorComponent } from './option-data-selector.component';

describe('OptionDataSelectorComponent', () => {
  let component: OptionDataSelectorComponent;
  let fixture: ComponentFixture<OptionDataSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionDataSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionDataSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
