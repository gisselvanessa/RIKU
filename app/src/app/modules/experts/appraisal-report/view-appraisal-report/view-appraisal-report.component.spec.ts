import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppraisalReportComponent } from './view-appraisal-report.component';

describe('ViewAppraisalReportComponent', () => {
  let component: ViewAppraisalReportComponent;
  let fixture: ComponentFixture<ViewAppraisalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAppraisalReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAppraisalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
