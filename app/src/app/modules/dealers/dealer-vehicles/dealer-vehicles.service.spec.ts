import { TestBed } from '@angular/core/testing';

import { DealerVehiclesService } from './dealer-vehicles.service';

describe('DealerVehiclesService', () => {
  let service: DealerVehiclesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealerVehiclesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
