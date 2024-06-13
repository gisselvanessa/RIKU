import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsPagesRoutingModule } from './cms-pages-routing.module';
import { AddEditPageComponent } from './add-edit-page.component';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { IWantToSellComponent } from './i-want-to-sell/i-want-to-sell.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    AddEditPageComponent,
    HomeComponent,
    AboutUsComponent,
    IWantToSellComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    CmsPagesRoutingModule,
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
export class CmsPagesModule { }
