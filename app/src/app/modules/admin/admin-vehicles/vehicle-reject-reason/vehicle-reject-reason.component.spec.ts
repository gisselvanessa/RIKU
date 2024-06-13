import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleRejectReasonComponent } from './vehicle-reject-reason.component';

describe('VehicleRejectReasonComponent', () => {
  let component: VehicleRejectReasonComponent;
  let fixture: ComponentFixture<VehicleRejectReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleRejectReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleRejectReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
