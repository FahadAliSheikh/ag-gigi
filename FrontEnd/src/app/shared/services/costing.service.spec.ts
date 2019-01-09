import { TestBed, inject } from '@angular/core/testing';

import { CostingService } from './costing.service';

describe('CostingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CostingService]
    });
  });

  it('should be created', inject([CostingService], (service: CostingService) => {
    expect(service).toBeTruthy();
  }));
});
