import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrderListComponent } from './order-list/order-list.component';
import { SharedModule } from "../../../shared/shared.module";
import { OrderDetailsComponent } from './order-details/order-details.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
    declarations: [
        OrderListComponent,
        OrderDetailsComponent
    ],
    imports: [
        CommonModule,
        OrdersRoutingModule,
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
export class OrdersModule { }
