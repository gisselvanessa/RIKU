import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVehicleProcedureListComponent } from './admin-vehicle-procedure-list.component';

describe('AdminVehicleProcedureListComponent', () => {
  let component: AdminVehicleProcedureListComponent;
  let fixture: ComponentFixture<AdminVehicleProcedureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminVehicleProcedureListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminVehicleProcedureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
