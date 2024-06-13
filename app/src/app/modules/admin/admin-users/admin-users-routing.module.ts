import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from 'src/app/guards/admin.guard';
import { AddUsersComponent } from './add-users/add-users.component';
import { UsersListComponent } from './users-list/users-list.component';
import { EditUsersComponent } from './edit-users/edit-users.component';
//import { UserDetailsComponent } from './user-details/user-details.component';
import { UserDetailsComponent } from 'src/app/shared/component/user-details/user-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'users-list',
    pathMatch: 'full',
  },
  {
    path: 'users-list',
    component: UsersListComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'add',
    component: AddUsersComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'user-details/:id',
    component: UserDetailsComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'edit/:id',
    component: EditUsersComponent,
    canActivate: [AdminAuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUsersRoutingModule { }
