import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerVehiclesRoutingModule } from './seller-vehicles-routing.module';
import { SellerVehiclesComponent } from './seller-vehicles.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddSellerVehicleComponent } from './add-vehicle/add-vehicle.component';
import { AddSellerVehicleDetailsComponent } from './add-vehicle-details/add-vehicle-details.component';
import { ViewSellerVehicleDetailsComponent } from './view-vehicle-details/view-vehicle-details.component';
import { SwiperModule } from 'swiper/angular';
import { SellerVehicleListComponent } from './vehicle-list/vehicle-list.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { VehicleSummaryComponent } from './add-vehicle-details/vehicle-summary/vehicle-summary.component';
// import { SellerHeaderComponent } from '../elements/header/header.component';
// import { SellerFooterComponent } from '../elements/footer/footer.component';

@NgModule({
  declarations: [
    SellerVehiclesComponent,
    AddSellerVehicleComponent,
    AddSellerVehicleDetailsComponent,
    ViewSellerVehicleDetailsComponent,
    SellerVehicleListComponent,
    VehicleSummaryComponent,
    // SellerHeaderComponent,
    // SellerFooterComponent
  ],
  imports: [
    SellerVehiclesRoutingModule,
    SwiperModule,
    SharedModule,
    ShareButtonsModule,
    ShareIconsModule,
    // BsDatepickerModule,
    // ToastrModule,
    // NgbModule
    SwiperModule,
    TranslateModule
  ],

})
export class SellerVehiclesModule { }
