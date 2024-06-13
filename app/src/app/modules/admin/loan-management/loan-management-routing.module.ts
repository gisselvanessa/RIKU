import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from 'src/app/guards/admin.guard';
import { LoanListComponent } from './loan-list/loan-list.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';


const routes: Routes = [
  {
    path: '',
    component: LoanListComponent,
    pathMatch: 'full',
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'details/:id',
    component: LoanDetailsComponent,
    canActivate: [AdminAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LoanManagementRoutingModule { }
