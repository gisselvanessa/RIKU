import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "./login.service";
import { emailValidator, SpaceValidator } from "../../../shared/validators";
import { TokenService } from "../../../shared/services/token.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../../shared/services/auth.service";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import {ResetPasswordComponent} from "../../../pages/modal/reset-password/reset-password.component";
// import {ForgotPasswordComponent} from "../../../pages/modal/forgot-password/forgot-password.component";
// import {ValidateUserComponent} from "../../modal/validate-user/validate-user.component";
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { UserService } from '../../../shared/services/user.service';
import { ResetPasswordComponent } from 'src/app/shared/modals/reset-password/reset-password.component';
import { ForgotPasswordComponent } from 'src/app/shared/modals/forgot-password/forgot-password.component';
import { OtpVerificationComponent } from 'src/app/shared/modals/otp-verification/otp-verification.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  submitting: boolean;
  errStatus: string;
  errMessage: string;
  err: any;
  type: string = 'password';
  formControls: any;
  loginparamsObject: any;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  resend: boolean = false;
  verificationType: string;
  loading: boolean = false;
  verificationName: string = '';
  isRememberMe: boolean = false;

  //subscription: Subscription

  constructor(
    public router: Router,
    private routerAct: ActivatedRoute,
    public fb: FormBuilder,
    public loginService: LoginService,
    private tokenService: TokenService,
    private authService: AuthService,
    private toastr: ToastrService,
    private userService: UserService,
    private modalService: NgbModal, public activeModal: NgbActiveModal,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.createLoginForm();
    this.formControls = this.form.controls;
    this.routerAct.queryParamMap
      .subscribe((params) => {
        this.loginparamsObject = { ...params.keys, ...params };
        /* console.log(this.loginparamsObject);
         if(localStorage.getItem('reset')){
           this.activeModal.dismiss()
           this.modalService.open(ResetPasswordComponent,{
             windowClass: 'forgot-pass-modal'
           })
         }*/
        if (this.loginparamsObject.params.token && this.loginparamsObject.params.type == 'RESET_PASSWORD') {
          localStorage.setItem("reset", JSON.stringify(this.loginparamsObject))
          this.router.navigate(['/auth/login'])
          this.modalService.open(ResetPasswordComponent, {
            windowClass: 'forgot-pass-modal'
          })
        }
      }
      );
  }

  createLoginForm() {
    this.form = this.fb.group({
      type: ['', Validators.required],
      email: [null, { validators: [Validators.required, emailValidator] }],
      password: [null, { validators: [Validators.required] }],
      mobile_no: [null, Validators.required]
      // remember_me: [false],
    });

    const isRemember = this.loginService.getRememberUser();
    if (isRemember) {
      this.form.controls['email'].setValue(isRemember.email);
      this.form.controls['mobile_no'].setValue(isRemember.mobile);
      this.form.controls['type'].setValue(isRemember.type);
      this.isRememberMe = true;
    }
  }

  showPassword() {
    if (this.type === 'password') {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  openForgot() {
    if (localStorage.getItem('reset')) {
      localStorage.removeItem('reset')
    }
    this.modalService.open(ForgotPasswordComponent, {
      windowClass: 'forgot-pass-modal'
    })
  }

  validateUser() {
    this.createLoginForm()
    const otpRef = this.modalService.open(OtpVerificationComponent, {
      windowClass: 'otp-verification-modal',
      size:'lg'
    })
    otpRef.componentInstance.OTPtype = 'verification';
  }


  onSubmit() {
    this.submitting = true;
    if (this.form.value.email) {
      this.form.controls['mobile_no'].clearValidators();
      this.form.get("mobile_no")?.updateValueAndValidity();
    }
    if (this.form.value.mobile_no) {
      this.form.controls['email'].clearValidators();
      this.form.get("email")?.updateValueAndValidity();
    }
    if (this.form.value.email && this.form.value.mobile_no?.number) {
      this.toastr.warning(this.translateService.instant('Please Provide Only One Input Email or Mobile'))
      return;
    }
    if (!this.form.valid) {
      //this.toastr.error('Form Fill Properly');
      return;
    }
    let formData;
    if (this.form.value.email) {
      formData = { user_input: this.form.value.email, type: this.form.value.type, password: this.form.value.password };
    }
    if (this.form.value.mobile_no) {
      let mobileNum = this.form.value.mobile_no.number.includes(this.form.value.mobile_no.dialCode) ? this.form.value.mobile_no.number.replace(this.form.value.mobile_no.dialCode, "") : this.form.value.mobile_no.number;
      mobileNum = mobileNum.replaceAll(/\s/g, '');
      formData = { user_input: mobileNum, country_code: this.form.value.mobile_no.dialCode, type: this.form.value.type, password: this.form.value.password };
    }
    this.loading = true;
    this.tokenService.logIn(formData).subscribe(
      (response) => {
        this.authService.setAccessTokenStorage(response.data.token);
        this.userService.setUserType(this.form.value.type);
        this.authService.changeLoggedIn(true);
        localStorage.setItem('username', response.data.user_name);
        const role = response.data.roles;
        localStorage.setItem('type', JSON.stringify(role))
        const userId = response.data.id;
        const userEmail = response.data.email;
        this.userService.setUserId(userId);
        this.userService.setUserEmail(userEmail);
        if( response.data.profile_img_url){
          const userProfileImage = response.data.profile_img_url;
          this.userService.setUserProfileImage(userProfileImage)
        }
        if (this.isRememberMe) {
          this.loginService.rememberUser({ email: this.form.value.email, mobile: this.form.value.mobile_no, type: this.form.value.type, remember_me: true })
        } else {
          this.loginService.removeRememberUser();
        }
        this.submitting = false;
        this.userService.navigateAsPerUserType(response.data.total_vehicles);
        this.toastr.success(this.translateService.instant('Successfully Login'));
      },
      ({ error, status }) => {
        let mobileDetails = error.data
        this.submitting = false;
        this.loading = false;
        this.err = error;
        this.errStatus = status;
        this.errMessage = error?.message;
        localStorage.setItem('resetUserData', JSON.stringify(mobileDetails))
        if (error?.error) {
          if (error.error_code == 'EMAIL_MOBILE_NOT_VERIFIED') {
            this.toastr.error(this.translateService.instant('Your mobile number and email are not verified, please enter OTP to verify.'))
            this.validateUser()
          }
          else if (error.error_code == 'EMAIL_NOT_VERIFIED' || error.error_code == 'MOBILE_NOT_VERIFIED') {
            this.verificationType = error.error_code;
            if (this.verificationType == 'EMAIL_NOT_VERIFIED') {
              // this.toastr.success('Verification Email has been sent')
              this.toastr.error(this.translateService.instant('Your email is not verified, please check your email to verify.'));
            } else if (this.verificationType == 'MOBILE_NOT_VERIFIED') {
              this.toastr.error(this.translateService.instant('Your mobile number is not verified, please enter OTP to verify.'));
              this.validateUser();
            }
          }else{
            this.toastr.error(this.translateService.instant(error.error[0]))
          }
        } else {
          this.toastr.error(this.translateService.instant('Something Went Wrong Please Try again later'));
        }
      }
    );
    //this.subscription.add(subscription1$)
  }

  clearCountrySearchBox() {
    const inputElement = document.getElementById("country-search-box") as HTMLInputElement;
    if (inputElement && inputElement.value) {
      inputElement.value = '';
    }
  }

  ngOnDestroy(): void {
    //this.subscription.unsubscribe();
  }
}
