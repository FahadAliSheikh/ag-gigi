import { TestBed, inject } from '@angular/core/testing';

import { PackageInformationService } from './package-information.service';

describe('PackageInformationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PackageInformationService]
    });
  });

  it('should be created', inject([PackageInformationService], (service: PackageInformationService) => {
    expect(service).toBeTruthy();
  }));
});
