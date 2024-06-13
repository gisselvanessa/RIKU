import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {CountryISO, PhoneNumberFormat, SearchCountryField} from 'ngx-intl-tel-input';
import {ForgotPasswordService} from 'src/app/shared/services/forgot-password.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OtpVerificationComponent} from '../otp-verification/otp-verification.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ForgotPasswordComponent implements OnInit {

  forgotPassword: FormGroup;
  modalRef:any
  forgotPasswordControls: any;
  isEmailSelected: boolean;
  successMessage: string;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  @Input() isForAdmin: boolean = false;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder,
              private toastr: ToastrService, private modalService: NgbModal,
              private forgotPasswordService: ForgotPasswordService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    if(this.isForAdmin){
      this.forgotPassword = this.fb.group({
        email: [null, [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/)]],
      });
      this.forgotPasswordControls = this.forgotPassword.controls;
    }else{
      this.forgotPassword = this.fb.group({
        login_type: ['email', Validators.nullValidator],
        email: [null, [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/)]],
        mobile_no: [null, [Validators.required]]
      });
      this.forgotPasswordControls = this.forgotPassword.controls;
      this.changeLogintype(true);
    }
  }

  changeLogintype(value: boolean) {
    this.isEmailSelected = value;
    if (this.isEmailSelected) {
      this.forgotPassword.get('email')?.setValidators([Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/)])
      this.forgotPassword.get('mobile_no')?.clearValidators();
      this.forgotPassword.get('mobile_no')?.updateValueAndValidity();
    } else {
      this.forgotPassword.get('mobile_no')?.setValidators([Validators.required])
      this.forgotPassword.get('email')?.clearValidators();
      this.forgotPassword.get('email')?.updateValueAndValidity();
    }
  }


  onSubmit() {
    if (this.forgotPassword.valid) {
      if(this.isForAdmin){
        this.forgotAdminPassword();
      }else{
        this.forgotUserPassword();
      }
    }
  }

  forgotAdminPassword(){
    let value= this.forgotPassword.value;
    this.forgotPasswordService.forgotAdminPassword({email:value.email}).pipe().subscribe(
      (response) => {
        this.activeModal.dismiss('Cross click')
        this.toastr.success(this.translate.instant('A reset password link has been sent to your email!'));
      },
      ({ error, status }) => {
        if (error.error[0]) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      });
  }

  forgotUserPassword(){
    let value = this.forgotPassword.value;
    if (this.isEmailSelected) {
      delete value.mobile_no;
      this.successMessage = this.translate.instant('A link has been sent to your email!');
    } else {
      delete value.email;
      value.country_code = value.mobile_no?.dialCode;
      value.mobile_no = value.mobile_no?.number;
      this.successMessage = this.translate.instant('An OTP has been sent to your mobile number!');
    }
    localStorage.setItem("resetUserData",JSON.stringify(value))
    this.forgotPasswordService.forgotPassword(value).pipe().subscribe(
      (response) => {
        this.activeModal.dismiss('Cross click')
        if (!this.isEmailSelected) {
        this.modalRef = this.modalService.open(OtpVerificationComponent, {
            windowClass: 'otp-verification-modal'
          })
          this.modalRef.componentInstance.OTPtype = 'forgot'
        }
        this.toastr.success(this.successMessage);
      },
      ({error, status}) => {
        if (error.error[0]) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }

      });
  }

  openOtpModel() {
    this.modalService.open(OtpVerificationComponent, {
      windowClass: 'otp-verification-modal'
    })
  }

  clearCountrySearchBox(){
    const inputElement = document.getElementById("country-search-box") as HTMLInputElement;
    if(inputElement && inputElement.value){
     inputElement.value ='';
    }
  }


  formatNumber(event:any){
    let current: string = event.target.value;
    current = current.replace(/[^\d-+ ]/g, '');
    this.forgotPasswordControls['mobile_no'].setValue(current);
  }
}
