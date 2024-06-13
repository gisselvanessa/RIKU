import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDeliveryComponent } from './vehicle-delivery.component';

describe('VehicleDeliveryComponent', () => {
  let component: VehicleDeliveryComponent;
  let fixture: ComponentFixture<VehicleDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDeliveryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
