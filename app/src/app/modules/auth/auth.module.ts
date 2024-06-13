import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCaptchaModule } from 'ngx-captcha';

import {AuthRoutingModule} from "./auth-routing.module";
import { SharedModule } from '../../shared/shared.module';

import { AuthService } from '../../shared/services/auth.service';



import { MobilePreApprovalComponent } from './mobile-pre-approval/mobile-pre-approval.component';


import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MobileVerificationComponent } from './mobile-verification/mobile-verification.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    SharedModule,
    TranslateModule,
    NgxCaptchaModule
  ],
  providers: [AuthService,NgbActiveModal,CookieService],
  declarations: [
    LoginComponent,
    SignupComponent,
    MobileVerificationComponent,
    MobilePreApprovalComponent
  ],

})
export class AuthModule {}
