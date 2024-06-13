import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from 'src/app/guards/admin.guard';
import { AdminVehicleProcedureDetailsComponent } from './admin-vehicle-procedure-details/admin-vehicle-procedure-details.component';
import { AdminVehicleProcedureListComponent } from './admin-vehicle-procedure-list/admin-vehicle-procedure-list.component';

const routes: Routes = [
  {
      path:'',
      component: AdminVehicleProcedureListComponent,
      canActivate: [AdminAuthGuard]
  },
  {
      path:'details/:id',
      component: AdminVehicleProcedureDetailsComponent,
      canActivate: [AdminAuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminVechicleProcedureRoutingModule { }
