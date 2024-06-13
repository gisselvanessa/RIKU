import { TestBed } from '@angular/core/testing';

import { ManageExpertsService } from './manage-experts.service';

describe('ManageExpertsService', () => {
  let service: ManageExpertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageExpertsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
