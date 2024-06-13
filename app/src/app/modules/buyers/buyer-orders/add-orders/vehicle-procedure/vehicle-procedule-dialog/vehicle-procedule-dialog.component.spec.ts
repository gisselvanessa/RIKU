import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleProceduleDialogComponent } from './vehicle-procedule-dialog.component';

describe('VehicleProceduleDialogComponent', () => {
  let component: VehicleProceduleDialogComponent;
  let fixture: ComponentFixture<VehicleProceduleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleProceduleDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleProceduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
