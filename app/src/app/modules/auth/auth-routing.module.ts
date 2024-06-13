import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from "./signup/signup.component";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { MobileVerificationComponent } from "./mobile-verification/mobile-verification.component";
import { LoginGuard } from "../../guards/login-guard.guard";
import { MobilePreApprovalComponent } from './mobile-pre-approval/mobile-pre-approval.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'signup', canActivate: [LoginGuard], component: SignupComponent,
  },
  {
    path: 'login', canActivate: [LoginGuard], component: LoginComponent,
  },
  {
    path: 'mobile-verification', canActivate: [LoginGuard], component: MobileVerificationComponent
  },
  {
    path: 'mobile-pre-approval', component: MobilePreApprovalComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
