import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleProcedureComponent } from './vehicle-procedure.component';

describe('VehicleProcedureComponent', () => {
  let component: VehicleProcedureComponent;
  let fixture: ComponentFixture<VehicleProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleProcedureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
