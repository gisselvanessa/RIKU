import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleProcedureDetailsComponent } from './vehicle-procedure-details.component';

describe('VehicleProcedureDetailsComponent', () => {
  let component: VehicleProcedureDetailsComponent;
  let fixture: ComponentFixture<VehicleProcedureDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleProcedureDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleProcedureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
