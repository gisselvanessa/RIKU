import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyerOrdersRoutingModule } from './buyer-orders-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AddOrdersComponent } from './add-orders/add-orders.component';
import { ScheduleMeetingComponent } from './add-orders/schedule-meeting/schedule-meeting.component';
import { BankDetailsComponent } from './add-orders/bank-details/bank-details.component';
import { BuyNowComponent } from './add-orders/buy-now/buy-now.component';
import { VehicleDetailsComponent } from './add-orders/vehicle-details/vehicle-details.component';
import { ReviewVehicleComponent } from './add-orders/review-vehicle/review-vehicle.component';
import { PriceNegotiationComponent } from './add-orders/price-negotiation/price-negotiation.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { BuyerOrderListComponent } from './buyer-order-list/buyer-order-list.component';
import { VehicleProceduleDialogComponent } from './add-orders/vehicle-procedure/vehicle-procedule-dialog/vehicle-procedule-dialog.component';
import { VehicleProcedureComponent } from './add-orders/vehicle-procedure/vehicle-procedure.component';
import { VehicleDeliveryComponent } from './add-orders/vehicle-delivery/vehicle-delivery.component';
import { CancelOrderDialogComponent } from './order-details/cancel-order-dialog/cancel-order-dialog.component';
import { BuyerVehicleProcedureDetailsComponent } from './vehicle-procedure-details/vehicle-procedure-details.component';
import { PriceNegotiationDialogComponent } from './add-orders/price-negotiation/price-negotiation-dialog/price-negotiation-dialog.component';
import { LoanDocumentsComponent } from './add-orders/loan-documents/loan-documents.component';






@NgModule({
  declarations: [BuyNowComponent, BankDetailsComponent, AddOrdersComponent, VehicleProceduleDialogComponent,
    BuyerOrderListComponent, ScheduleMeetingComponent, VehicleProcedureComponent, VehicleDetailsComponent, ReviewVehicleComponent, PriceNegotiationComponent, OrderDetailsComponent, VehicleDeliveryComponent, CancelOrderDialogComponent, BuyerVehicleProcedureDetailsComponent, PriceNegotiationDialogComponent, LoanDocumentsComponent],
  imports: [
    CommonModule,
    BuyerOrdersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ]
})

export class BuyerOrdersModule { }
