import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { OtpVerificationComponent } from "../otp-verification/otp-verification.component";
import { emailValidator } from "../../../shared/validators";
import { LoginService } from 'src/app/modules/auth/login/login.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-validate-user',
  templateUrl: './validate-user.component.html',
  styleUrls: ['./validate-user.component.scss']
})
export class ValidateUserComponent implements OnInit {
  @Input() public verificationType: any;
  resendForm: FormGroup;
  resendFormControls: any;
  email: boolean;
  mobile: boolean;
  successMessage: string;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  submitting: any;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private translate: TranslateService,
    private toastr: ToastrService, private modalService: NgbModal,
    private loginService: LoginService) { }

  ngOnInit(): void {
    this.resendForm = this.fb.group({
      type: ['email'],
      email: ['', [Validators.required, emailValidator]],
      mobile_no: ['', [Validators.required]]
    });
    this.resendFormControls = this.resendForm.controls;
    if (this.verificationType == 'EMAIL_NOT_VERIFIED') {
      this.email = true
    } else if (this.verificationType == 'MOBILE_NOT_VERIFIED') {
      this.mobile = true
    }
  }

  onSubmit() {
    if (this.resendForm.value.email) {
      this.resendForm.controls['mobile_no'].clearValidators();
      this.resendForm.get("mobile_no")?.updateValueAndValidity();
    }
    if (this.resendForm.value.mobile_no) {
      this.resendForm.controls['email'].clearValidators();
      this.resendForm.get("email")?.updateValueAndValidity();
    }
    this.submitting = true;

    if (!this.resendForm.valid) {
      this.toastr.error(this.translate.instant('Form Fill Properly'));
      return;
    }
    let formData = {}
    if (this.email) {
      formData = {
        type: 'email',
        email: this.resendForm.value.email,
      }
      this.successMessage = 'A link has been sent to your email!';
    }
    if (this.mobile) {
      formData = {
        type: 'mobile',
        country_code: this.resendForm.value.mobile_no.dialCode,
        mobile_no: this.resendForm.value.mobile_no.number
      }
      this.successMessage = 'A link has been sent to your mobile!';
    }
    if (this.resendForm.valid) {
      localStorage.setItem('resetUserData', JSON.stringify(formData))
      this.loginService.sendLinkOTP(formData).pipe().subscribe(
        (response) => {
          this.activeModal.dismiss('Cross click')
          if (this.mobile) {
            const otpRef = this.modalService.open(OtpVerificationComponent, {
              windowClass: 'otp-verification-modal'
            })
            otpRef.componentInstance.OTPtype = 'verification';
          }


          this.toastr.success(this.translate.instant(this.successMessage));
        },
        ({ error, status }) => {

          if (error.error[0]) {
            this.activeModal.dismiss('Cross click')
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }

        });
    }
  }

  clearCountrySearchBox(){
    const inputElement = document.getElementById("country-search-box") as HTMLInputElement;
    if(inputElement && inputElement.value){
     inputElement.value ='';
    }
   }
}
