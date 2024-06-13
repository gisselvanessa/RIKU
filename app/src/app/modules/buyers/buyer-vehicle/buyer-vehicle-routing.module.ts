import { NgModule } from '@angular/core';
import { BuyerVehicleListComponent } from "./buyer-vehicle-list/buyer-vehicle-list.component";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from '../../../guards/auth.guard';
import { BuyerVehicleDetailsComponent } from './buyer-vehicle-details/buyer-vehicle-details.component';
import { BecomeSellerComponent } from './become-seller/become-seller.component';
import { VehiclePoliciesComponent } from './vehicle-policies/vehicle-policies.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'buyer-vehicle-list',
    pathMatch: 'full',

  },
  {
    path: 'buyer-vehicle-list',
    component: BuyerVehicleListComponent,
   // canActivate: [AuthGuard]
  },
  {
    path: 'vehicle-details/:id',
    component: BuyerVehicleDetailsComponent,
  //  canActivate: [AuthGuard]
  },
  {
    path: 'become-seller',
    component: BecomeSellerComponent,
  //  canActivate: [AuthGuard]
  },
  {
    path: 'policies/:policyName',
    component: VehiclePoliciesComponent,
   // canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BuyerVehicleRoutingModule { }
