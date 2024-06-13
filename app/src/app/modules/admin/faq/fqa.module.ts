import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FqaRoutingModule } from './fqa-routing.module';
import { FaqComponent } from './faq/faq.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddFaqComponent } from './add-faq/add-faq.component';
import { EditFaqComponent } from './edit-faq/edit-faq.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    FaqComponent,
    AddFaqComponent,
    EditFaqComponent
  ],
  imports: [
    CommonModule,
    FqaRoutingModule,
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
export class FqaModule { }
