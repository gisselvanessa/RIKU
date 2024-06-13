import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyAddedVehiclesComponent } from './recently-added-vehicles.component';

describe('RecentlyAddedVehiclesComponent', () => {
  let component: RecentlyAddedVehiclesComponent;
  let fixture: ComponentFixture<RecentlyAddedVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentlyAddedVehiclesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentlyAddedVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
