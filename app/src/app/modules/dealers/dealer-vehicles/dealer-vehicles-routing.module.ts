import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DealerVehicleListComponent } from './dealer-vehicle-list/dealer-vehicle-list.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { DealerAddVehicleComponent } from './dealer-add-vehicle/dealer-add-vehicle.component';
import { DealerAddVehicleDetailsComponent } from './dealer-add-vehicle-details/dealer-add-vehicle-details.component';
import { DealerViewVehicleDetailsComponent } from './dealer-view-vehicle-details/dealer-view-vehicle-details.component';

const routes: Routes = [
  {
   path: '',
   redirectTo: 'vehicle-list',
   pathMatch: 'full',
   },
  {
    path: 'vehicle-list',
    component: DealerVehicleListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-vehicle',
    component: DealerAddVehicleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-vehicle/:id',
    component: DealerAddVehicleDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-vehicle-details',
    component: DealerAddVehicleDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'view-vehicle-details/:id',
    component: DealerViewVehicleDetailsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealerVehiclesRoutingModule { }
