import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewVehicleComponent } from './review-vehicle.component';

describe('ReviewVehicleComponent', () => {
  let component: ReviewVehicleComponent;
  let fixture: ComponentFixture<ReviewVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
