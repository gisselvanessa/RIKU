import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { AdminAuthGuard } from '../../../guards/admin.guard';
import { OrdersResolver } from './orders.resolver';
import { OrderDetailsComponent } from './order-details/order-details.component';

const routes: Routes = [
  {
    path:'',
    component: OrderListComponent,
    canActivate: [AdminAuthGuard],
    resolve: { orders: OrdersResolver }
  },
  {
    path:'details/:id',
    component: OrderDetailsComponent,
    canActivate: [AdminAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
