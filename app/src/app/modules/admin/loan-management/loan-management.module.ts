import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanListComponent } from './loan-list/loan-list.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { LoanManagementRoutingModule } from './loan-management-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AdminApplicantDocumentsComponent } from './loan-details/applicant-documents/applicant-documents.component';
import { NotApproveDialogComponent } from './not-approve-dialog/not-approve-dialog.component';


@NgModule({
  declarations: [LoanListComponent, LoanDetailsComponent, AdminApplicantDocumentsComponent, NotApproveDialogComponent],
  imports: [
    CommonModule,
    LoanManagementRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class LoanManagementModule { }
