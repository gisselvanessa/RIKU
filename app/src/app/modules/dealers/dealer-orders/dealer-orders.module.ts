import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { DealerOrdersRoutingModule } from './dealer-orders-routing.module';
import { DealerOrderListComponent } from './dealer-order-list/dealer-order-list.component';
import { DealerOrderDetailsComponent } from './dealer-order-details/dealer-order-details.component';
import { DealerVehicleProcedureDetailsComponent } from './dealer-vehicle-procedure-details/dealer-vehicle-procedure-details.component';





@NgModule({
    declarations: [
        DealerOrderListComponent,
        DealerVehicleProcedureDetailsComponent,
        DealerOrderDetailsComponent
    ],
    imports: [
        CommonModule,
        DealerOrdersRoutingModule,
        SharedModule,
        TranslateModule
    ]
})
export class DealerOrdersModule { }
