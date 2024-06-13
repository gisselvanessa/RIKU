import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { TotalUserRegistrationsComponent } from './total-user-registrations/total-user-registrations.component';
import { EarningsComponent } from './earnings/earnings.component';
import { OrderStatisticsComponent } from './order-statistics/order-statistics.component';
import { VehicleStatisticsComponent } from './vehicle-statistics/vehicle-statistics.component';
import { EarningPerPostComponent } from './earning-per-post/earning-per-post.component';
import { RecentlyAddedVehiclesComponent } from './recently-added-vehicles/recently-added-vehicles.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { httpTranslateLoader } from 'src/app/app.module';



@NgModule({
  declarations: [
    DashboardComponent,
    TotalUserRegistrationsComponent,
    EarningsComponent,
    OrderStatisticsComponent,
    VehicleStatisticsComponent,
    EarningPerPostComponent,
    RecentlyAddedVehiclesComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ]
})
export class DashboardModule { }


