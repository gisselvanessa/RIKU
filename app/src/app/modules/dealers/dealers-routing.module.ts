import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DealerProfileComponent } from './dealer-profile/dealer-profile.component';
import { ViewDealerProfileComponent } from './view-dealer-profile/view-dealer-profile.component';
import { EditDealerProfileComponent } from './edit-dealer-profile/edit-dealer-profile.component';
import { DealerChatComponent } from './dealer-chat/dealer-chat.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ExpertReviewListComponent } from 'src/app/shared/component/expert-review-list/expert-review-list.component';
import { ExpertReviewDetailsComponent } from 'src/app/shared/component/expert-review-details/expert-review-details.component';
import { ExpertReviewComponent } from 'src/app/shared/component/expert-review/expert-review.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DealerAuthGuard } from 'src/app/guards/dealer-auth.guard';
import { DealerPlansComponent } from './dealer-plans/dealer-plans.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, DealerAuthGuard]
  },
  {
    path: 'vehicles',
    loadChildren: () => import('./dealer-vehicles/dealer-vehicles.module').then(m => m.DealerVehiclesModule),
    canActivate: [AuthGuard, DealerAuthGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./dealer-orders/dealer-orders.module').then(m => m.DealerOrdersModule),
    canActivate: [AuthGuard, DealerAuthGuard]
  },
  {
    path: 'dealer-profile/:id',
    component: DealerProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'my-profile',
    component: ViewDealerProfileComponent,
    canActivate: [AuthGuard, DealerAuthGuard]
  },
  {
    path: 'edit-profile',
    component: EditDealerProfileComponent,
    canActivate: [AuthGuard, DealerAuthGuard]
  },
  {
    path: 'chat-user',
    component: DealerChatComponent,
    canActivate: [AuthGuard, DealerAuthGuard]
  },
  {
    path:'expert-reviews',
    component:ExpertReviewListComponent,
    canActivate: [AuthGuard, DealerAuthGuard]
  },
  {
    path:'add-expert-review',
    component:ExpertReviewComponent,
    canActivate: [AuthGuard, DealerAuthGuard]
  },
  {
    path:'expert-review-details/:id',
    component: ExpertReviewDetailsComponent,
    canActivate: [AuthGuard, DealerAuthGuard]
  },
  {
    path:'dealer-plans',
    component: DealerPlansComponent,
    canActivate: [AuthGuard, DealerAuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealersRoutingModule { }
