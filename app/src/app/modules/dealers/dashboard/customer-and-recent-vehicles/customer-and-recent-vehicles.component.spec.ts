import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAndRecentVehiclesComponent } from './customer-and-recent-vehicles.component';

describe('CustomerAndRecentVehiclesComponent', () => {
  let component: CustomerAndRecentVehiclesComponent;
  let fixture: ComponentFixture<CustomerAndRecentVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerAndRecentVehiclesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerAndRecentVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
