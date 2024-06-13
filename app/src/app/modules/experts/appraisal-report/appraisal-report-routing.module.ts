import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from 'src/app/guards/admin.guard';
import { AddAppraisalReportComponent } from './add-appraisal-report/add-appraisal-report.component';
import { ViewAppraisalReportComponent } from './view-appraisal-report/view-appraisal-report.component';
const routes: Routes = [
  {
    path:'add/:id',
    component: AddAppraisalReportComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path:'view/:id',
    component: ViewAppraisalReportComponent,
    canActivate: [AdminAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppraisalReportRoutingModule { }
