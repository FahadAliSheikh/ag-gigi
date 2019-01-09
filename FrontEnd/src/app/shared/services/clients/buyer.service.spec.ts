import { TestBed, inject } from '@angular/core/testing';

import { BuyerService } from './buyer.service';

describe('BuyerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BuyerService]
    });
  });

  it('should be created', inject([BuyerService], (service: BuyerService) => {
    expect(service).toBeTruthy();
  }));
});
