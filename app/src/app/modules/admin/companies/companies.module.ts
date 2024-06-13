import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { CompaniesRoutingModule } from './company-routing.module';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AddCompanyComponent } from './add-company/add-company.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { ComapanyListComponent } from './comapany-list/comapany-list.component';
import { DeleteCompanyComponent } from './delete-company/delete-company.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    ComapanyListComponent,
    CompanyDetailComponent,
    AddCompanyComponent,
    DeleteCompanyComponent
  ],
  imports: [
    CommonModule,
    CompaniesRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
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
export class CompaniesModule { }
