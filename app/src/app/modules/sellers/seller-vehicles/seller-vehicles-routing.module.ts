import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { AddSellerVehicleComponent } from './add-vehicle/add-vehicle.component';
import { ViewSellerVehicleDetailsComponent } from './view-vehicle-details/view-vehicle-details.component';
import { SellerVehicleListComponent } from './vehicle-list/vehicle-list.component';
import { AddSellerVehicleDetailsComponent } from './add-vehicle-details/add-vehicle-details.component';
import { AuthGuard } from '../../../guards/auth.guard';
import { UserAuthGuard } from 'src/app/guards/user-auth.guard';

const routes: Routes = [
  {
   path: '',
   redirectTo: 'vehicle-list',
   pathMatch: 'full',
   },
  {
    path: 'vehicle-list',
    component: SellerVehicleListComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path: 'add-vehicle',
    component: AddSellerVehicleComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path: 'edit-vehicle/:id',
    component: AddSellerVehicleDetailsComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path: 'add-vehicle-details',
    component: AddSellerVehicleDetailsComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path: 'view-vehicle-details/:id',
    component: ViewSellerVehicleDetailsComponent,
    canActivate: [AuthGuard]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerVehiclesRoutingModule { }
