import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { UserDetailsComponent } from 'src/app/shared/component/user-details/user-details.component';
import { BuyerChatComponent } from './buyer-chat/buyer-chat.component';
import { BuyerFavouritesComponent } from './buyer-favourites/buyer-favourites.component';
import { EditBuyerProfileComponent } from './edit-buyer-profile/edit-buyer-profile.component';
import { ViewBuyerProfileComponent } from './view-buyer-profile/view-buyer-profile.component';
import { BuyerCallComponent } from './buyer-call/buyer-call.component';
import { ExpertReviewComponent } from 'src/app/shared/component/expert-review/expert-review.component';
import { ExpertReviewDetailsComponent } from '../../shared/component/expert-review-details/expert-review-details.component';
import { ExpertReviewListComponent } from '../../shared/component/expert-review-list/expert-review-list.component';
import { BuyerAuthGuard } from 'src/app/guards/buyer-auth.guard';
import { UserAuthGuard } from 'src/app/guards/user-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'vehicles',
    pathMatch: 'full',
  },
  {
    path: 'vehicles',
    loadChildren: () => import('./buyer-vehicle/buyer-vehicle.module').then(m => m.BuyerVehicleModule),
    canActivate: [UserAuthGuard]
  },
  {
    path: 'buyer-orders',
    loadChildren: () => import('./buyer-orders/buyer-orders.module').then(m => m.BuyerOrdersModule),
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path: 'expert-reviews',
    component: ExpertReviewListComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path: 'add-expert-review',
    component: ExpertReviewComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path: 'expert-review-details/:id',
    component: ExpertReviewDetailsComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path: 'buyer-favourite',
    component: BuyerFavouritesComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path: 'profile/:id',
    component: UserDetailsComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path: 'my-profile',
    component: ViewBuyerProfileComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path: 'edit-profile',
    component: EditBuyerProfileComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path: 'call',
    component: BuyerCallComponent
  },
  {
    path: 'chat-user',
    component: BuyerChatComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BuyersRoutingModule { }
