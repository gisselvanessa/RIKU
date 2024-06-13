import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVehicleProcedureDetailsComponent } from './admin-vehicle-procedure-details.component';

describe('AdminVehicleProcedureDetailsComponent', () => {
  let component: AdminVehicleProcedureDetailsComponent;
  let fixture: ComponentFixture<AdminVehicleProcedureDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminVehicleProcedureDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminVehicleProcedureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
