import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerVehicleProcedureDetailsComponent } from './dealer-vehicle-procedure-details.component';

describe('DealerVehicleProcedureDetailsComponent', () => {
  let component: DealerVehicleProcedureDetailsComponent;
  let fixture: ComponentFixture<DealerVehicleProcedureDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerVehicleProcedureDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerVehicleProcedureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
