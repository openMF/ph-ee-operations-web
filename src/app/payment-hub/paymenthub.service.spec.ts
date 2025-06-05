import { TestBed } from '@angular/core/testing';

import { PaymenthubService } from './paymenthub.service';

describe('PaymenthubService', () => {
  let service: PaymenthubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymenthubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
