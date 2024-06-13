import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerRoutingModule } from './sellers-routing.module';
import { SellersComponent } from './sellers.component';
import { RouterModule } from '@angular/router'
import { SharedModule } from 'src/app/shared/shared.module';
import { SellerProfileComponent } from './seller-profile/seller-profile.component';
import { ViewSellerProfileComponent } from './view-seller-profile/view-seller-profile.component';
import { EditSellerProfileComponent } from './edit-seller-profile/edit-seller-profile.component';
import { SellerChatComponent } from './seller-chat/seller-chat.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SellersComponent,
    SellerProfileComponent,
    ViewSellerProfileComponent,
    EditSellerProfileComponent,
    SellerChatComponent
  ],
  imports: [
    CommonModule,
    SellerRoutingModule,
    RouterModule,
    SharedModule,
    TranslateModule,
  ]
})
export class SellersModule { }
