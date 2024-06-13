import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVehicleProcedureComponent } from './new-vehicle-procedure.component';

describe('NewVehicleProcedureComponent', () => {
  let component: NewVehicleProcedureComponent;
  let fixture: ComponentFixture<NewVehicleProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NewVehicleProcedureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewVehicleProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
