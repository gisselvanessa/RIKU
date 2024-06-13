import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerVehicleDetailsComponent } from './buyer-vehicle-details.component';

describe('BuyerVehicleDetailsComponent', () => {
  let component: BuyerVehicleDetailsComponent;
  let fixture: ComponentFixture<BuyerVehicleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerVehicleDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerVehicleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
