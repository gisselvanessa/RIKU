import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectVehicleConfirmationComponent } from './reject-vehicle-confirmation.component';

describe('RejectVehicleConfirmationComponent', () => {
  let component: RejectVehicleConfirmationComponent;
  let fixture: ComponentFixture<RejectVehicleConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectVehicleConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectVehicleConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
