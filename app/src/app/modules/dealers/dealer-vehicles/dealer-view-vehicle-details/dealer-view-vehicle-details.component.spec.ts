import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerViewVehicleDetailsComponent } from './dealer-view-vehicle-details.component';

describe('DealerViewVehicleDetailsComponent', () => {
  let component: DealerViewVehicleDetailsComponent;
  let fixture: ComponentFixture<DealerViewVehicleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerViewVehicleDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerViewVehicleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
