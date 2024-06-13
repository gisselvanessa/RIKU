import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSellerVehicleComponent } from './add-vehicle.component';

describe('AddSellerVehicleComponent', () => {
  let component: AddSellerVehicleComponent;
  let fixture: ComponentFixture<AddSellerVehicleComponent>;

  console.log(1);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSellerVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSellerVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
