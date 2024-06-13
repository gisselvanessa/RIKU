import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DealerOrderListComponent } from './dealer-order-list/dealer-order-list.component';
import { DealerOrderDetailsComponent } from './dealer-order-details/dealer-order-details.component';
import { DealerVehicleProcedureDetailsComponent } from './dealer-vehicle-procedure-details/dealer-vehicle-procedure-details.component';
import { DealerOrdersResolver } from './dealer-orders.resolver';
import { ViewAppraisalReportComponent } from '../../experts/appraisal-report/view-appraisal-report/view-appraisal-report.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'order-list',
    pathMatch: 'full',
  },
  {
    path: 'order-details/:id',
    component: DealerOrderDetailsComponent
  },
  {
    path: 'order-list',
    component: DealerOrderListComponent,
    resolve: { orders: DealerOrdersResolver }
  },
  {
    path: 'vehicle-procedure-details/:id',
    component: DealerVehicleProcedureDetailsComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'appraisal-report/:id',
    component: ViewAppraisalReportComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealerOrdersRoutingModule { }
