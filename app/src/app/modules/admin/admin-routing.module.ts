import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from 'src/app/guards/admin.guard';
import { LoginGuard } from 'src/app/guards/login-guard.guard';
import { RolesPermissionsResolver } from 'src/app/shared/services/roles-permissions.resolver';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { EditProfileComponent } from './manage-profile/edit-profile/edit-profile.component';
import { ViewProfileComponent } from './manage-profile/view-profile/view-profile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: AdminLoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'activity-log',
    loadChildren: () => import('./activity-log/activity-log.module').then(m => m.ActivityLogModule),
    resolve: { modulePermissions: RolesPermissionsResolver },
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    resolve: { modulePermissions: RolesPermissionsResolver },
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'vehicles',
    loadChildren: () => import('./admin-vehicles/admin-vehicles.module').then(m => m.AdminVehiclesModule),
    resolve: { modulePermissions: RolesPermissionsResolver },
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./admin-users/admin-users.module').then(m => m.AdminUsersModule),
    resolve: { modulePermissions: RolesPermissionsResolver },
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'companies',
    loadChildren: () => import('./companies/companies.module').then(m => m.CompaniesModule),
    resolve: { modulePermissions: RolesPermissionsResolver },
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'team-members',
    loadChildren: () => import('./team-members/team-members.module').then(m => m.TeamMembersModule),
    resolve: { modulePermissions: RolesPermissionsResolver },
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'roles',
    loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule),
    resolve: { modulePermissions: RolesPermissionsResolver },
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'experts',
    loadChildren: () => import('./manage-experts/manage-experts.module').then(m => m.ManageExpertsModule),
    resolve: { modulePermissions: RolesPermissionsResolver },
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule),
    resolve: { modulePermissions: RolesPermissionsResolver },
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'vehicle-procedure',
    loadChildren: () => import('./admin-vehicle-procedure/admin-vehicle-procedure.module').then(m => m.AdminVehicleProcedureModule),
    resolve: { modulePermissions: RolesPermissionsResolver },
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/fqa.module').then(m => m.FqaModule),
    resolve: { modulePermissions: RolesPermissionsResolver },
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'manage-contact-us',
    loadChildren: () => import('./manage-contact-us/manage-contact-us.module').then(m => m.ManageContactUsModule),
    canActivate: [AdminAuthGuard],
    resolve: { modulePermissions: RolesPermissionsResolver }
  },
  {
    path:  'view-profile',
    component:  ViewProfileComponent,
    canActivate:  [AdminAuthGuard]
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
    canActivate: [AdminAuthGuard],
    resolve: { modulePermissions: RolesPermissionsResolver }
  },
  {
    path: 'cms-pages',
    loadChildren: () => import('./cms-pages/cms-pages.module').then(m => m.CmsPagesModule),
    canActivate: [AdminAuthGuard],
    resolve: { modulePermissions: RolesPermissionsResolver }
  },
  {
    path: 'loans',
    loadChildren: () => import('./loan-management/loan-management.module').then(m => m.LoanManagementModule),
    canActivate: [AdminAuthGuard],
    resolve: { modulePermissions: RolesPermissionsResolver }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
