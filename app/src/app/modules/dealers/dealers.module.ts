import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealersRoutingModule } from './dealers-routing.module';
import { DealersComponent } from './dealers.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DealerProfileComponent } from './dealer-profile/dealer-profile.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ViewDealerProfileComponent } from './view-dealer-profile/view-dealer-profile.component';
import { EditDealerProfileComponent } from './edit-dealer-profile/edit-dealer-profile.component';
import { DealerChatComponent } from './dealer-chat/dealer-chat.component';
import { DealerOrdersModule } from './dealer-orders/dealer-orders.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EarningsComponent } from './dashboard/earnings/earnings.component';
import { VehicleStatisticsComponent } from './dashboard/vehicle-statistics/vehicle-statistics.component';
import { CustomerAndRecentVehiclesComponent } from './dashboard/customer-and-recent-vehicles/customer-and-recent-vehicles.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DealersComponent,
    DealerProfileComponent,
    ViewDealerProfileComponent,
    EditDealerProfileComponent,
    DealerChatComponent,
    DashboardComponent,
    EarningsComponent,
    VehicleStatisticsComponent,
    CustomerAndRecentVehiclesComponent,
  ],
  imports: [
    CommonModule,
    DealersRoutingModule,
    RouterModule,
    SharedModule,
    NgxSliderModule,
    DealerOrdersModule,
    TranslateModule
  ]
})
export class DealersModule { }
