import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellerProfileComponent } from './seller-profile/seller-profile.component';
import { ViewSellerProfileComponent } from './view-seller-profile/view-seller-profile.component';
import { EditSellerProfileComponent } from './edit-seller-profile/edit-seller-profile.component';
import { SellerOrdersModule } from './seller-orders/seller-orders.module';
import { SellerChatComponent } from './seller-chat/seller-chat.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ExpertReviewDetailsComponent } from 'src/app/shared/component/expert-review-details/expert-review-details.component';
import { ExpertReviewListComponent } from 'src/app/shared/component/expert-review-list/expert-review-list.component';
import { ExpertReviewComponent } from 'src/app/shared/component/expert-review/expert-review.component';
import { SellerAuthGuard } from 'src/app/guards/seller-auth.guard';
import { UserAuthGuard } from 'src/app/guards/user-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'vehicles',
    pathMatch: 'full',
  },
  {
    path: 'my-vehicles',
    loadChildren: () => import('./seller-vehicles/seller-vehicles.module').then(m => m.SellerVehiclesModule),
    canActivate: [UserAuthGuard]
  },
  {
    path: 'seller-orders',
    loadChildren: () => import('./seller-orders/seller-orders.module').then(m => m.SellerOrdersModule),
    canActivate: [UserAuthGuard]
  },
  {
    path: 'seller-profile/:id',
    component: SellerProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'my-profile',
    component: ViewSellerProfileComponent,
    canActivate: [UserAuthGuard]
  },
  {
    path: 'edit-profile',
    component: EditSellerProfileComponent,
    canActivate: [UserAuthGuard]

  },
  {
    path: 'chat-user',
    component: SellerChatComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path:'seller-expert-reviews',
    component:ExpertReviewListComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path:'add-expert-review',
    component:ExpertReviewComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path:'expert-review-details/:id',
    component: ExpertReviewDetailsComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
