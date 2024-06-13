import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminVechicleProcedureRoutingModule } from './admin-vehicle-procedure-routing.module';
import { AdminVehicleProcedureListComponent } from './admin-vehicle-procedure-list/admin-vehicle-procedure-list.component';
import { AdminVehicleProcedureDetailsComponent } from './admin-vehicle-procedure-details/admin-vehicle-procedure-details.component';
import { RequestForDocComponent } from './shared/request-for-doc/request-for-doc.component';
import { SharedModule } from "../../../shared/shared.module";
import { DocumentsComponent } from './shared/documents/documents.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    AdminVehicleProcedureListComponent,
    AdminVehicleProcedureDetailsComponent,
    RequestForDocComponent,
    DocumentsComponent
  ],
  imports: [
    CommonModule,
    AdminVechicleProcedureRoutingModule,
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

export class AdminVehicleProcedureModule { }
