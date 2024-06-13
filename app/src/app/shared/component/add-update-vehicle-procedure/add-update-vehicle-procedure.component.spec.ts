import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateVehicleProcedureComponent } from './add-update-vehicle-procedure.component';

describe('AddUpdateVehicleProcedureComponent', () => {
  let component: AddUpdateVehicleProcedureComponent;
  let fixture: ComponentFixture<AddUpdateVehicleProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateVehicleProcedureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateVehicleProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
