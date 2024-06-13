import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppraisalReportRoutingModule } from './appraisal-report-routing.module';
import { AddAppraisalReportComponent } from './add-appraisal-report/add-appraisal-report.component';
import { ViewAppraisalReportComponent } from './view-appraisal-report/view-appraisal-report.component';
import { MyDetailsComponent } from './common/basic-details/my-details/my-details.component';
import { CustomerInformationComponent } from './common/basic-details/customer-information/customer-information.component';
import { VehicleInformationComponent } from './common/basic-details/vehicle-information/vehicle-information.component';
import { StateOfConversationComponent } from './common/state-of-conversation/state-of-conversation.component';
import { ComparisonTableComponent } from './common/comparison-table/comparison-table.component';
import { AdditionalDetailsComponent } from './common/additional-details/additional-details.component';
import { UploadSignatureDialogComponent } from './common/upload-signature-dialog/upload-signature-dialog.component';

@NgModule({
  declarations: [
    AddAppraisalReportComponent,
    ViewAppraisalReportComponent,
    MyDetailsComponent,
    CustomerInformationComponent,
    VehicleInformationComponent,
    StateOfConversationComponent,
    ComparisonTableComponent,
    AdditionalDetailsComponent,
    UploadSignatureDialogComponent
  ],
  imports: [
    CommonModule,
    AppraisalReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    NgbNavModule
  ]
})
export class AppraisalReportModule { }
