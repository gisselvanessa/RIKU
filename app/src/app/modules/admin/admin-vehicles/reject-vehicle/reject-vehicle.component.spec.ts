import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectVehicleComponent } from './reject-vehicle.component';

describe('AdminVehicleListComponent', () => {
  let component: RejectVehicleComponent;
  let fixture: ComponentFixture<RejectVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
