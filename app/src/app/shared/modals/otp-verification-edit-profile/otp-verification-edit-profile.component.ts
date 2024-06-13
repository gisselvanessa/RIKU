import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgOtpInputComponent, NgOtpInputConfig } from "ng-otp-input";
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginService } from 'src/app/modules/auth/login/login.service';
import { Error } from '../../models/error.model';
import { UpdateEmailMobileNumberService } from '../../services/update-email-mobile-number.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-otp-verification-edit-profile',
  templateUrl: './otp-verification-edit-profile.component.html',
  styleUrls: ['./otp-verification-edit-profile.component.scss']
})
export class OtpVerificationEditProfileComponent implements OnInit {


  //input variable
  @Input() public editProfileOTP: any;
  @Input() public type = '';
  @Input() public isAdmin: boolean = false;

  //conutdown timer variables
  secondsConter = 30;
  disabledResendButton: boolean = true;
  // OTP variables
  @ViewChild(NgOtpInputComponent, { static: false }) ngOtpInput: NgOtpInputComponent;
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: ''
  };
  otp: string;
  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    public loginService: LoginService,
    private updateEmailMobileNumberService:UpdateEmailMobileNumberService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.decreaseSeconds();
  }

  //this function is called when user update OTP
  onOtpChange(otp: any) {
    this.otp = otp;
  }

  //this function is called fo countdown timer
  decreaseSeconds() {
    let interval = setInterval(() => {
      if (this.secondsConter > 0) {
        this.secondsConter--;
      } else {
        this.disabledResendButton = false;
        clearInterval(interval);
      }
    }, 1000)
  }

  //this function is used to resent the OTP
  resendOTP() {
    const apiEndPoint: any = this.isAdmin ? this.updateEmailMobileNumberService.sendAdminOTP(this.editProfileOTP) : this.updateEmailMobileNumberService.sendOTP(this.editProfileOTP);
    apiEndPoint.pipe().subscribe({
      next: () => {
        const message = this.type ? 'email!' : 'mobile number!' ;
        this.toastr.success(this.translate.instant(`OTP has been sent to your ${message}`));
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        if (error.error[0]) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    });
  }

  //this function is user to verify OTP
  verifyMobile() {
    let verification: any = {};
    verification.type = this.editProfileOTP.type;
    verification.verification_type = this.editProfileOTP.verification_type
    verification.otp = this.otp;
    if (this.otp != undefined && this.otp.length == 4) {
      const apiEndPoint: any = this.isAdmin ? this.updateEmailMobileNumberService.verifyAdminOTP(verification) : this.updateEmailMobileNumberService.verifyOTP(verification);
      apiEndPoint.pipe().subscribe({
        next: () => {
          this.activeModal.close(true);
          this.toastr.success(this.translate.instant('Verification Success!!'));
        },
        error: (errorRes: Error) => {
          const error = errorRes.error;
          if (error.error[0]) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }
      });
    } else {
      this.toastr.error(this.translate.instant('Otp is required'));
    }
  }

}
