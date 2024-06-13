import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpertReviewComponent } from 'src/app/shared/component/expert-review/expert-review.component';
import { AuthGuard } from '../../../guards/auth.guard';
import { ViewAppraisalReportComponent } from '../../experts/appraisal-report/view-appraisal-report/view-appraisal-report.component';

import { AddOrdersComponent } from './add-orders/add-orders.component';
import { BankDetailsComponent } from './add-orders/bank-details/bank-details.component';
import { BuyNowComponent } from './add-orders/buy-now/buy-now.component';
import { BuyerOrderListComponent } from './buyer-order-list/buyer-order-list.component';
//import { ExpertReviewComponent } from './expert-review/expert-review.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { BuyerVehicleProcedureDetailsComponent } from './vehicle-procedure-details/vehicle-procedure-details.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'order-list',
    pathMatch: 'full',
  },
  {
    path: 'add-order/:id',
    component: AddOrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order-list',
    component: BuyerOrderListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'buy-now',
    component: BuyNowComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'bank-details',
    component: BankDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'expert-review',
    component: ExpertReviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order-details/:id',
    component: OrderDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order-details',
    component: OrderDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vehicle-procedure-details/:id',
    component: BuyerVehicleProcedureDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'appraisal-report/:id',
    component:ViewAppraisalReportComponent,
    canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerOrdersRoutingModule { }
