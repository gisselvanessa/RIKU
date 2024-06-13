import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { SellerOrdersRoutingModule } from './seller-orders-routing.module';
import { SellerOrderDetailsComponent } from './seller-order-details/seller-order-details.component';
import { SellerOrderListComponent } from './seller-order-list/seller-order-list.component';
import { SellerVehicleProcedureDetailsComponent } from './seller-vehicle-procedure-details/seller-vehicle-procedure-details.component';

@NgModule({
  declarations: [
    SellerOrderDetailsComponent,
    SellerOrderListComponent,
    SellerVehicleProcedureDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SellerOrdersRoutingModule,
    TranslateModule
  ]
})
export class SellerOrdersModule { }
