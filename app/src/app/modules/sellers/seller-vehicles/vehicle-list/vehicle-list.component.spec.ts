import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerVehicleListComponent } from './vehicle-list.component';

describe('HomeComponent', () => {
  let component: SellerVehicleListComponent;
  let fixture: ComponentFixture<SellerVehicleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerVehicleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerVehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
