import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from 'src/app/guards/admin.guard';
import { ActivityLogListComponent } from './activity-log-list/activity-log-list.component';
import { UpdatedDataComponent } from './updated-data/updated-data.component';

const routes: Routes = [
  {
    path: '',
    component: ActivityLogListComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'list',
    component: ActivityLogListComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path:'updated-details/:id',
    component:UpdatedDataComponent,
    canActivate:[AdminAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityLogRoutingModule { }
