import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelProcedureDialogComponent } from './cancel-procedure-dialog.component';

describe('CancelProcedureDialogComponent', () => {
  let component: CancelProcedureDialogComponent;
  let fixture: ComponentFixture<CancelProcedureDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelProcedureDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelProcedureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
