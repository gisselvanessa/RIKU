import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerVehiclesComponent } from './seller-vehicles.component';

describe('SellerVehiclesComponent', () => {
  let component: SellerVehiclesComponent;
  let fixture: ComponentFixture<SellerVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerVehiclesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
