import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageContactUsRoutingModule } from './manage-contact-us-routing.module';
import { ContactUsListingComponent } from './contact-us-listing/contact-us-listing.component';
import { ShareModule } from 'ngx-sharebuttons';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [ContactUsListingComponent, ViewDetailsComponent, SendEmailComponent],
  imports: [
    CommonModule,
    ManageContactUsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })]
})
export class ManageContactUsModule { }
