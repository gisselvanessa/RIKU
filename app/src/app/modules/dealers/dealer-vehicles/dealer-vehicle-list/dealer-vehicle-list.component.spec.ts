import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerVehicleListComponent } from './dealer-vehicle-list.component';

describe('DealerVehicleListComponent', () => {
  let component: DealerVehicleListComponent;
  let fixture: ComponentFixture<DealerVehicleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerVehicleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerVehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
