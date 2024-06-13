import { NgModule } from '@angular/core';
import { AdminVehiclesRoutingModule } from './admin-vehicles-routing.module';
import { AdminVehicleDetailsComponent } from './vehicle-details/admin-vehicle-details.component';
import { SwiperModule } from 'swiper/angular';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminVehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleRejectReasonComponent } from './vehicle-reject-reason/vehicle-reject-reason.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    AdminVehicleDetailsComponent,
    AdminVehicleListComponent,
    VehicleRejectReasonComponent
  ],
  imports: [
    CommonModule,
    ShareButtonsModule,
    AdminVehiclesRoutingModule,
    SwiperModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [NgbActiveModal],
})
export class AdminVehiclesModule { }
