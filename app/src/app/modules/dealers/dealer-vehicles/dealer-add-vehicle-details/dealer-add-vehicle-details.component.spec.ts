import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerAddVehicleDetailsComponent } from './dealer-add-vehicle-details.component';

describe('DealerAddVehicleDetailsComponent', () => {
  let component: DealerAddVehicleDetailsComponent;
  let fixture: ComponentFixture<DealerAddVehicleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerAddVehicleDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerAddVehicleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
