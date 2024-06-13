import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { LoanCandidateDetailsComponent } from './loan-candidate-details/loan-candidate-details.component';
import { LoanListComponent } from './loan-list/loan-list.component';
import { FinancingComponent } from './financing/financing.component';
import { PreApprovalComponent } from './pre-approval/pre-approval.component';
import { BuyerAuthGuard } from 'src/app/guards/buyer-auth.guard';
import { UserAuthGuard } from 'src/app/guards/user-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'loan-list',
    pathMatch: 'full',
  },
  {
    path: 'pre-approval',
    component: PreApprovalComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path: 'loan-list',
    component: LoanListComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  },
  {
    path: 'financing',
    component: FinancingComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'loan-candidate-details',
    component:LoanCandidateDetailsComponent,
    canActivate: [AuthGuard, UserAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanProcedureRoutingModule { }
