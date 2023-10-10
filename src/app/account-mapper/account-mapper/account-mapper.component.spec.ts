import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMapperComponent } from './account-mapper.component';

describe('AccountMapperComponent', () => {
  let component: AccountMapperComponent;
  let fixture: ComponentFixture<AccountMapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountMapperComponent]
    });
    fixture = TestBed.createComponent(AccountMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
