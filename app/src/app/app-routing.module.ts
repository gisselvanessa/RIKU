import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { VehiclePoliciesComponent } from './modules/buyers/buyer-vehicle/vehicle-policies/vehicle-policies.component';
import { AboutUsComponent } from './modules/about-us/about-us.component';
import { IWantToSellComponent } from './modules/i-want-to-sell/i-want-to-sell.component';
import { ComingSoonComponent } from './modules/coming-soon/coming-soon.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('../app/modules/auth/auth.module').then((m) => m.AuthModule),
  },
  { path: 'home', component: HomeComponent },
  { path: '404', component: NotFoundComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'want-to-sell', component: IWantToSellComponent },
  {
    path: 'admin',
    loadChildren: () => import('../app/modules/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'expert',
    loadChildren: () => import('./modules/experts/expert.module').then((m) => m.ExpertModule)
  },
 /*  {
    path: 'seller',
    loadChildren: () => import('../app/modules/sellers/sellers.module').then((m) => m.SellersModule),
  }, */
  {
    path: 'user',
    loadChildren: () => import('../app/modules/buyers/buyers.module').then((m) => m.BuyersModule),
  },
  {
    path: 'dealer',
    loadChildren: () => import('../app/modules/dealers/dealers.module').then((m) => m.DealersModule),
  },
  {
    path: 'faq',
    loadChildren: () => import('../app/modules/faq/faq.module').then((m) => m.FaqModule),
  },
  {
    path: 'policies/:policyName',
    component: VehiclePoliciesComponent
  },
  {
    path: 'loan',
    loadChildren: () => import('./modules/loan-procedure/loan-procedure.module').then((m) => m.LoanProcedureModule),
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./modules/contact-us/contact-us.module').then((m) => m.ContactUsModule),
  },
  {
    path: 'blogs',
    loadChildren: () => import('./modules/blog/blog.module').then((m) => m.BlogModule),
  },
  {
    path: 'notifications',
    loadChildren: () => import('./modules/notifications/notifications.module').then((m) => m.NotificationsModule),
  },
  { path: 'coming-soon', component: ComingSoonComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
