import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerVehicleProcedureDetailsComponent } from './seller-vehicle-procedure-details.component';

describe('SellerVehicleProcedureDetailsComponent', () => {
  let component: SellerVehicleProcedureDetailsComponent;
  let fixture: ComponentFixture<SellerVehicleProcedureDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerVehicleProcedureDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerVehicleProcedureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
