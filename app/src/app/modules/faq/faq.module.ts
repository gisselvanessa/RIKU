import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqComponent } from './faq/faq.component';
import { FaqRoutingModule } from './faq-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations:[FaqComponent],
  imports: [
    CommonModule,
    FaqRoutingModule,
    FormsModule,
    SharedModule,
    TranslateModule
  ]
}) 
export class FaqModule { }
 