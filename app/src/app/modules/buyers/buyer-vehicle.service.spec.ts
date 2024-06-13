import { TestBed } from '@angular/core/testing';

import { BuyerVehicleService } from './buyer-vehicle.service';

describe('BuyerVehicleService', () => {
  let service: BuyerVehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuyerVehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
