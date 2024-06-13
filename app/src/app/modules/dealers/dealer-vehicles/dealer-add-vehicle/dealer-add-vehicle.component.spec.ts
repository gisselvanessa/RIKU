import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerAddVehicleComponent } from './dealer-add-vehicle.component';

describe('DealerAddVehicleComponent', () => {
  let component: DealerAddVehicleComponent;
  let fixture: ComponentFixture<DealerAddVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerAddVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerAddVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
