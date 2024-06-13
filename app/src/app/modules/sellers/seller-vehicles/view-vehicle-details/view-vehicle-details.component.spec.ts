import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSellerVehicleDetailsComponent } from './view-vehicle-details.component';

describe('VehicleDetailsComponent', () => {
  let component: ViewSellerVehicleDetailsComponent;
  let fixture: ComponentFixture<ViewSellerVehicleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSellerVehicleDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSellerVehicleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
