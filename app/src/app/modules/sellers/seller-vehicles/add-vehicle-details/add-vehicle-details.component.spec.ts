import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSellerVehicleDetailsComponent } from './add-vehicle-details.component';

describe('AddSellerVehicleDetailsComponent', () => {
  let component: AddSellerVehicleDetailsComponent;
  let fixture: ComponentFixture<AddSellerVehicleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSellerVehicleDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSellerVehicleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
