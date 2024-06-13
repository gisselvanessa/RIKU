import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyersRoutingModule } from './buyers-routing.module';
import { BuyersComponent } from './buyers.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { BuyerFavouritesComponent } from './buyer-favourites/buyer-favourites.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewBuyerProfileComponent } from './view-buyer-profile/view-buyer-profile.component';
import { EditBuyerProfileComponent } from './edit-buyer-profile/edit-buyer-profile.component';
import { BuyerCallComponent } from './buyer-call/buyer-call.component';
import { BuyerChatComponent } from './buyer-chat/buyer-chat.component';
import { TranslateModule } from '@ngx-translate/core';
import { SellerRoutingModule } from '../sellers/sellers-routing.module';
import { SellersComponent } from '../sellers/sellers.component';
import { EditSellerProfileComponent } from '../sellers/edit-seller-profile/edit-seller-profile.component';
import { SellerChatComponent } from '../sellers/seller-chat/seller-chat.component';
import { SellerProfileComponent } from '../sellers/seller-profile/seller-profile.component';
import { ViewSellerProfileComponent } from '../sellers/view-seller-profile/view-seller-profile.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    BuyersComponent,
    BuyerFavouritesComponent,
    ViewBuyerProfileComponent,
    EditBuyerProfileComponent,
    BuyerCallComponent,
    BuyerChatComponent,

    SellersComponent,
    SellerProfileComponent,
    ViewSellerProfileComponent,
    EditSellerProfileComponent,
    SellerChatComponent,
  ],
  providers: [NgbActiveModal],
  imports: [
    CommonModule,
    BuyersRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,

    SellerRoutingModule,
    RouterModule,
  ],
})
export class BuyersModule {}
