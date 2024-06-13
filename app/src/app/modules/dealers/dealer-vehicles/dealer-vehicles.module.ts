import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'swiper/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

import { DealerVehiclesRoutingModule } from './dealer-vehicles-routing.module';

import { DealerVehiclesComponent } from './dealer-vehicles.component';
import { DealerVehicleListComponent } from './dealer-vehicle-list/dealer-vehicle-list.component';
import { DealerAddVehicleComponent } from './dealer-add-vehicle/dealer-add-vehicle.component';
import { DealerAddVehicleDetailsComponent } from './dealer-add-vehicle-details/dealer-add-vehicle-details.component';
import { DealerViewVehicleDetailsComponent } from './dealer-view-vehicle-details/dealer-view-vehicle-details.component';
import { DealerFormNewComponent } from './dealer-form-new/dealer-form-new.component';
import { DealerFormItemComponent } from './dealer-form-new/dealer-form-item/dealer-form-item.component';
import { DealerPlansComponent } from '../dealer-plans/dealer-plans.component';


@NgModule({
  declarations: [
    DealerVehiclesComponent,
    DealerVehicleListComponent,
    DealerAddVehicleComponent,
    DealerAddVehicleDetailsComponent,
    DealerViewVehicleDetailsComponent,
    DealerFormNewComponent,
    DealerFormItemComponent,
    DealerPlansComponent
  ],
  imports: [
    DealerVehiclesRoutingModule,
    SwiperModule,
    SharedModule,
    ShareButtonsModule,
    ShareIconsModule,
    TranslateModule
  ],
})
export class DealerVehiclesModule { }
