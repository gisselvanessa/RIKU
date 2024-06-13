import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVehicleListComponent } from './vehicle-list.component';

describe('AdminVehicleListComponent', () => {
  let component: AdminVehicleListComponent;
  let fixture: ComponentFixture<AdminVehicleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminVehicleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminVehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
