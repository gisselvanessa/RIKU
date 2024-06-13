import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxSliderModule } from "@angular-slider/ngx-slider";

import { LoanProcedureRoutingModule } from './loan-procedure-routing.module';

import { LoanCandidateDetailsComponent } from './loan-candidate-details/loan-candidate-details.component';
import { ViewLoanDetailsComponent } from './view-loan-details/view-loan-details.component';
import { LoanListComponent } from './loan-list/loan-list.component';
import { ApplicantInformationComponent } from './loan-candidate-details/applicant-information/applicant-information.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FinancingComponent } from './financing/financing.component';
import { CoApplicantComponent } from './loan-candidate-details/co-applicant/co-applicant.component';
import { PersonalReferenceComponent } from './loan-candidate-details/personal-reference/personal-reference.component';
import { ApplicationReviewComponent } from './loan-candidate-details/application-review/application-review.component';
import { SummaryComponent } from './loan-candidate-details/summary/summary.component';
import { TranslateModule } from '@ngx-translate/core';
import { PreApprovalComponent } from './pre-approval/pre-approval.component';
import { CancelLoanDialogComponent } from './cancel-loan-dialog/cancel-loan-dialog.component';


@NgModule({
  declarations: [
    LoanCandidateDetailsComponent,
    ViewLoanDetailsComponent,
    LoanListComponent,
    ApplicantInformationComponent,
    FinancingComponent,
    CoApplicantComponent,
    PersonalReferenceComponent,
    ApplicationReviewComponent,
    SummaryComponent,
    PreApprovalComponent,
    CancelLoanDialogComponent
  ],
  imports: [
    CommonModule,
    NgxSliderModule,
    LoanProcedureRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class LoanProcedureModule { }
