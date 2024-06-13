import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerVehicleListComponent } from './buyer-vehicle-list.component';

describe('BuyerVehicleListComponent', () => {
  let component: BuyerVehicleListComponent;
  let fixture: ComponentFixture<BuyerVehicleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerVehicleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerVehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
