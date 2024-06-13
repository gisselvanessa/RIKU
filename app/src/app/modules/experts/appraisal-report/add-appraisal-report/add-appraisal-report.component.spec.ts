import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppraisalReportComponent } from './add-appraisal-report.component';

describe('AddAppraisalReportComponent', () => {
  let component: AddAppraisalReportComponent;
  let fixture: ComponentFixture<AddAppraisalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAppraisalReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAppraisalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
