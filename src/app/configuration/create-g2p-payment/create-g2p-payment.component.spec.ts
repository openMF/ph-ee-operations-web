import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateG2pProgramComponent } from './create-g2p-program.component';

describe('CreateG2pProgramComponent', () => {
  let component: CreateG2pProgramComponent;
  let fixture: ComponentFixture<CreateG2pProgramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateG2pProgramComponent]
    });
    fixture = TestBed.createComponent(CreateG2pProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
