import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from 'src/app/guards/admin.guard';
import { ContactUsListingComponent } from './contact-us-listing/contact-us-listing.component';
import { ViewDetailsComponent } from './view-details/view-details.component';

const routes: Routes = [

  {
    path: '',
    component: ContactUsListingComponent,
    canActivate: [AdminAuthGuard],
    // resolve: { modulePermissions: RolesPermissionsResolver }
  },
  {
    path: 'view-detail/:id',
    component: ViewDetailsComponent,
    canActivate: [AdminAuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageContactUsRoutingModule { }
