import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from 'src/app/guards/admin.guard';
import { ExpertUserDetailsComponent } from './expert-user-details/expert-user-details.component';
import { AddUpdateExpertComponent } from './add-update-expert/add-update-expert.component';
import { ExpertListComponent } from './expert-list/expert-list.component';
import { RolesPermissionsResolver } from 'src/app/shared/services/roles-permissions.resolver';

const routes: Routes = [
  {
    path:'',
    component: ExpertListComponent,
    canActivate: [AdminAuthGuard],
    resolve: { modulePermissions: RolesPermissionsResolver }
  },
  {
    path:'add',
    component: AddUpdateExpertComponent,
    canActivate: [AdminAuthGuard],
    resolve: { modulePermissions: RolesPermissionsResolver }
  },
  {
    path:'edit/:id',
    component: AddUpdateExpertComponent,
    canActivate: [AdminAuthGuard],
    resolve: { modulePermissions: RolesPermissionsResolver }
  },
  {
    path:'details/:id',
    component: ExpertUserDetailsComponent,
    canActivate: [AdminAuthGuard],
    resolve: { modulePermissions: RolesPermissionsResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageExpertsRoutingModule { }
