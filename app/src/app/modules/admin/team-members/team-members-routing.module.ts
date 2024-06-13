import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from 'src/app/guards/admin.guard';
import { AddMembersComponent } from './add-members/add-members.component';
import { MembersListComponent } from './members-list/members-list.component';
import { TeamMemberDetailsComponent } from './team-member-details/team-member-details.component';

const routes: Routes = [
  {
    path: '',
    component: MembersListComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'add-members',
    component: AddMembersComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'edit-members/:id',
    component: AddMembersComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'members-list',
    component: MembersListComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'team-member-details/:id',
    component: TeamMemberDetailsComponent,
    canActivate: [AdminAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamMembersRoutingModule { }
