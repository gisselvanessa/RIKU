import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyerVehicleListComponent } from "./buyer-vehicle-list/buyer-vehicle-list.component";
import { BuyerVehicleRoutingModule } from "./buyer-vehicle-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { VehiclePoliciesComponent } from './vehicle-policies/vehicle-policies.component';
import { SwiperModule } from 'swiper/angular';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { BuyerVehicleDetailsComponent } from './buyer-vehicle-details/buyer-vehicle-details.component';
import { BecomeSellerComponent } from './become-seller/become-seller.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TermsConditionsChatCallComponent } from './terms-conditions-chat-call/terms-conditions-chat-call.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    BuyerVehicleListComponent,
    VehiclePoliciesComponent,
    BuyerVehicleDetailsComponent,
    BecomeSellerComponent,
    TermsConditionsChatCallComponent
  ],
  imports: [
    CommonModule,
    BuyerVehicleRoutingModule,
    FormsModule, NgbModule, NgxSliderModule, ReactiveFormsModule,
    SwiperModule,
    ShareButtonsModule,
    ShareIconsModule,
    SharedModule,
    TranslateModule
  ]
})
export class BuyerVehicleModule { }
