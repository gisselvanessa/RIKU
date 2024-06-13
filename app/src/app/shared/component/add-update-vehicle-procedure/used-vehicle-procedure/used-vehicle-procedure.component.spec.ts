import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsedVehicleProcedureComponent } from './used-vehicle-procedure.component';

describe('UsedVehicleProcedureComponent', () => {
  let component: UsedVehicleProcedureComponent;
  let fixture: ComponentFixture<UsedVehicleProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UsedVehicleProcedureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsedVehicleProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
