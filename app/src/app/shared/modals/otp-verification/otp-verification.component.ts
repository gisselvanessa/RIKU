import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ResetPasswordComponent } from "../reset-password/reset-password.component";
import { NgOtpInputComponent, NgOtpInputConfig } from "ng-otp-input";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginService } from 'src/app/modules/auth/login/login.service';
import { ForgotPasswordService } from 'src/app/shared/services/forgot-password.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})

export class OtpVerificationComponent implements OnInit {
  @Input() public OTPtype: any;
  resetData: any;
  mobile_no = '';
  country_code = '';
  otp: string;
  showOtpComponent = true;
  @ViewChild(NgOtpInputComponent, { static: false }) ngOtpInput: NgOtpInputComponent;
  mobilleVerification: FormGroup;
  mobileVerificationControls: any;
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: ''
  };
  secondsConter = 30;
  disabledResendButton: boolean = true;
  inputMobile: boolean = false;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  mobileInfo: FormGroup;
  changeData = {
    email: '',
    country_code: '',
    new_number: "",
    old_number: '',
    new_country_code: ""
  }
  email: string = ''


  constructor(private authService: AuthService, public activeModal: NgbActiveModal, private router: Router,
    private fb: FormBuilder, private toastr: ToastrService, private modalService: NgbModal,
    private forgotPasswordService: ForgotPasswordService, private translate: TranslateService,
    public loginService: LoginService) { }

  ngOnInit(): void {
    this.resetData = JSON.parse(localStorage.getItem('resetUserData') || "")
    this.mobile_no = this.resetData.mobile_no;
    this.country_code = this.resetData.country_code;
    this.email = this.resetData.email
    this.changeData.country_code = this.country_code;
    this.changeData.old_number = this.mobile_no;
    this.changeData.email = this.email

    this.decreaseSeconds();
    this.createMobileFieldForm();
  }

  createMobileFieldForm() {
    this.mobileInfo = this.fb.group({
      mobile_no: [this.country_code + this.mobile_no, [Validators.required]],
    })
  }
  onOtpChange(otp: any) {
    this.otp = otp;
  }

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

  resendVerificationCode() {
    if (this.OTPtype === 'forgot') {
    let data = { mobile_no: this.mobile_no, login_type: 'mobile', country_code: this.country_code }
    this.forgotPasswordService.forgotPassword(data).subscribe((response) => {
      this.toastr.success(this.translate.instant('Verification code resent.'));
      this.secondsConter = 30;
      this.disabledResendButton = true;
      this.decreaseSeconds();
    },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      });
    } else if (this.OTPtype === 'verification') {
      let data = { mobile_no: this.mobile_no, type: 'mobile', country_code: this.country_code }
      this.authService.sendVerificationCode(data).subscribe((response) => {
        this.toastr.success(this.translate.instant('Verification code resent.'));
        this.disabledResendButton = true
        this.secondsConter = 30
        this.decreaseSeconds();
      },
        ({ error, status }) => {
          if (error) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        });
      }
  }
  verifyMobile() {
    if (this.otp != undefined && this.otp.length == 4) {
      let resetdata = { mobile_no: this.mobile_no, code: this.otp, country_code: this.country_code }
      if (this.OTPtype === 'forgot') {
        this.authService.verifyOtpForgotpassword(resetdata).subscribe(() => {
          this.toastr.success(this.translate.instant('Verification Success!!'));
          localStorage.setItem("resetUserData", JSON.stringify(resetdata));
          this.modalService.open(ResetPasswordComponent, {
            windowClass: 'forgot-pass-modal'
          })
          this.activeModal.dismiss('close');
        })
      } else if (this.OTPtype === 'verification') {
        this.authService.verify_mobile(resetdata).subscribe(() => {
          this.toastr.success(this.translate.instant('Verification Success!!'));
          localStorage.removeItem("resetUserData");
          this.activeModal.dismiss('close');
        },
          ({ error, status }) => {
            if (error) {
              this.toastr.error(error.error[0]);
            } else {
              this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
            }
          });
      }
    } else {
      this.toastr.error(this.translate.instant('Otp is required'));
    }
  }

  submitMobile() {
    if (this.mobileInfo.invalid) {
      return;
    } else {
      this.changeData.new_number = this.mobileInfo.value.mobile_no.number;
      this.changeData.new_country_code = this.mobileInfo.value.mobile_no.dialCode;
      this.country_code = this.mobileInfo.value.mobile_no.dialCode;
      const mobile_no: any = this.mobileInfo.value.mobile_no.number.includes(this.country_code) ? this.mobileInfo.value.mobile_no.number.replace(this.country_code, "") :  this.mobileInfo.value.mobile_no.number;
      this.mobile_no = mobile_no.replaceAll(/\s/g,'');
      this.changeData.new_number = this.mobile_no;
      this.authService.changeMobileNumberUser(this.changeData).subscribe((response) => {
        this.toastr.success(this.translate.instant('Verification code resent.'));
        this.changeData.old_number = this.mobile_no;
        this.changeData.country_code = this.country_code;
        localStorage.setItem('mobile_no', this.mobile_no);
        localStorage.setItem('country_code', this.country_code);
        this.showInput();
      },
        ({ error, status }) => {
          if (error) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        });

    }
  }
  showInput() {
    this.inputMobile = !this.inputMobile;
  }

  clearCountrySearchBox(){
    const inputElement = document.getElementById("country-search-box") as HTMLInputElement;
    if(inputElement && inputElement.value){
     inputElement.value ='';
    }
   }

}

