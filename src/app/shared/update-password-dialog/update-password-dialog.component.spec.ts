import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePasswordDialogComponent } from './update-password-dialog.component';

describe('UpdatePasswordDialogComponent', () => {
  let component: UpdatePasswordDialogComponent;
  let fixture: ComponentFixture<UpdatePasswordDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePasswordDialogComponent]
    });
    fixture = TestBed.createComponent(UpdatePasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
