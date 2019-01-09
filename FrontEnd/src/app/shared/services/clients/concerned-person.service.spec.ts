import { TestBed, inject } from '@angular/core/testing';

import { ConcernedPersonService } from './concerned-person.service';

describe('ConcernedPersonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConcernedPersonService]
    });
  });

  it('should be created', inject([ConcernedPersonService], (service: ConcernedPersonService) => {
    expect(service).toBeTruthy();
  }));
});
