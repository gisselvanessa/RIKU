import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVehicleDetailsComponent } from './admin-vehicle-details.component';

describe('AdminVehicleDetailsComponent', () => {
  let component: AdminVehicleDetailsComponent;
  let fixture: ComponentFixture<AdminVehicleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminVehicleDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminVehicleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
