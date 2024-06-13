import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelLoanDialogComponent } from './cancel-loan-dialog.component';

describe('CancelLoanDialogComponent', () => {
  let component: CancelLoanDialogComponent;
  let fixture: ComponentFixture<CancelLoanDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelLoanDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelLoanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
