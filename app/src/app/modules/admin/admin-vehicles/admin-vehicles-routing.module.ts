import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from 'src/app/guards/admin.guard';
import { AdminVehicleDetailsComponent } from './vehicle-details/admin-vehicle-details.component';
import { AdminVehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleRejectReasonComponent } from './vehicle-reject-reason/vehicle-reject-reason.component';

const routes: Routes = [
  {
   path: '',
   redirectTo: 'vehicle-list',
   pathMatch: 'full',
  },
  {
    path: 'vehicle-list',
    component: AdminVehicleListComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'vehicle-details/:id',
    component: AdminVehicleDetailsComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'vehicle-details/:id/reject',
    component: VehicleRejectReasonComponent,
    canActivate: [AdminAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminVehiclesRoutingModule { }
