import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageExpertsRoutingModule } from './manage-experts-routing.module';
import { ExpertUserDetailsComponent } from './expert-user-details/expert-user-details.component';
import { AddUpdateExpertComponent } from './add-update-expert/add-update-expert.component';
import { ExpertListComponent } from './expert-list/expert-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';




@NgModule({
  declarations: [
    ExpertUserDetailsComponent,
    AddUpdateExpertComponent,
    ExpertListComponent
  ],
  imports: [
    CommonModule,
    ManageExpertsRoutingModule,
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
export class ManageExpertsModule { }
