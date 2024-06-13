import { TestBed } from '@angular/core/testing';

import { DealerProfileService } from './dealer-profile.service';

describe('DealerProfileService', () => {
  let service: DealerProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealerProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
