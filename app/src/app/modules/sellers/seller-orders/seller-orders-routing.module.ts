import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../guards/auth.guard';
import { ViewAppraisalReportComponent } from '../../experts/appraisal-report/view-appraisal-report/view-appraisal-report.component';
import { SellerOrderDetailsComponent } from './seller-order-details/seller-order-details.component';
import { SellerOrderListComponent } from './seller-order-list/seller-order-list.component';
import { SellerOrdersResolver } from './seller-orders.resolver';
import { SellerVehicleProcedureDetailsComponent } from './seller-vehicle-procedure-details/seller-vehicle-procedure-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'order-list',
    pathMatch: 'full',
  },
  {
    path: 'order-details/:id',
    component: SellerOrderDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order-list',
    component: SellerOrderListComponent,
    canActivate: [AuthGuard],
    resolve: { orders: SellerOrdersResolver }
  },
  {
    path: 'vehicle-procedure-details/:id',
    component: SellerVehicleProcedureDetailsComponent,
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
export class SellerOrdersRoutingModule { }
