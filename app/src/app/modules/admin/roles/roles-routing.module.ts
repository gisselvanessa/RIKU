import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleListComponent } from './role-list/role-list.component';
import { AdminAuthGuard } from '../../../guards/admin.guard';
import { AddEditRoleComponent } from './add-edit-role/add-edit-role.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { RolesResolver } from './roles.resolver';

const routes: Routes = [
  {
   path: '',
   redirectTo: 'role-list',
   pathMatch: 'full',
  },
  {
    path: 'role-list',
    component: RoleListComponent,
    canActivate: [AdminAuthGuard],
    resolve: { roles: RolesResolver }
  },
  {
    path: 'add',
    component: AddEditRoleComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'edit/:id',
    component: AddEditRoleComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'details/:id',
    component: RoleDetailsComponent,
    canActivate: [AdminAuthGuard]
    // resolve: { roleDetail: RolesResolver }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
