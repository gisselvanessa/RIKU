import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';
import { ToastrService } from 'ngx-toastr';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { TranslateService } from '@ngx-translate/core';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';

@Component({
  selector: 'app-mobile-verification',
  templateUrl: './mobile-verification.component.html',
  styleUrls: ['./mobile-verification.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MobileVerificationComponent implements OnInit {
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
    email: localStorage.getItem('email') as string,
    country_code: localStorage.getItem('country_code') as string,
    new_number: "",
    old_number: localStorage.getItem('mobile_no') as string,
    new_country_code: ""
  }


  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder,
  private toastr: ToastrService, private translate: TranslateService, private modalService:NgbModal) { }

  ngOnInit(): void {
    this.mobile_no = localStorage.getItem('mobile_no') as string;
    this.country_code = localStorage.getItem('country_code') as string;

    let mobileNum: any = this.mobile_no.includes(this.country_code) ? this.mobile_no.replace(this.country_code, ""): this.mobile_no;
    mobileNum = mobileNum.replaceAll(/\s/g,'');
    this.mobile_no = mobileNum;
    // if(!this.mobile_no){
    //   this.toastr.error('Mobile number not found please try again')
    //   this.router.navigate(['/login']);
    // }
    this.decreaseSeconds();
    this.createMobileFieldForm();
  }

  createMobileFieldForm() {
    this.mobileInfo = this.fb.group({
      mobile_no: [this.country_code + this.mobile_no, [Validators.required]],
    })
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

  onOtpChange(otp: any) {
    this.otp = otp;
  }
  verifyMobile() {
    if (this.otp != undefined && this.otp.length == 4) {
      let mobileNum: any = this.mobile_no.includes(this.country_code) ? this.mobile_no.replace(this.country_code, ""): this.mobile_no;
      mobileNum = mobileNum.replaceAll(/\s/g,'');
      let data = { mobile_no: this.mobile_no, code: this.otp, country_code: this.country_code }
      //this.router.navigate(['/login']);
      this.authService.verify_mobile(data).subscribe((response) => {
        localStorage.removeItem('mobile_no');
        localStorage.removeItem('country_code');
        //this.toastr.success(this.translate.instant('Verification success!!'));
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'registration-success-modal ',
        });
        modalRef.componentInstance.registrationSuccess = true;
        this.router.navigate(['auth/login']);
      },
        ({ error, status }) => {
          if (error) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        });
    } else {
      this.toastr.error(this.translate.instant('Otp is required'));
    }
  }

  resendVerificationCode() {
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


  submitMobile() {
    if (this.mobileInfo.invalid) {
      return;
    } else {
      const mobile_number :any = this.mobileInfo.value.mobile_no.number.includes(this.country_code) ? this.mobileInfo.value.mobile_no.number.replace(this.country_code,"") : this.mobileInfo.value.mobile_no.number ;
      this.changeData.new_number = mobile_number;
      this.changeData.new_country_code = this.mobileInfo.value.mobile_no.dialCode;
      this.country_code = this.mobileInfo.value.mobile_no.dialCode;
      // this.mobile_no = this.mobileInfo.value.mobile_no.number;
      const mobile_no: any = this.mobileInfo.value.mobile_no.number.includes(this.country_code) ? this.mobileInfo.value.mobile_no.number.replace(this.country_code, "") :  this.mobileInfo.value.mobile_no.number;
      this.mobile_no = mobile_no.replaceAll(/\s/g,'');
      this.authService.changeMobileNumberUser(this.changeData).subscribe((response) => {
        this.toastr.success(this.translate.instant('Verification code resent.'));
        this.changeData.old_number = this.mobile_no;
        this.changeData.country_code = this.country_code;
        localStorage.setItem('mobile_no', this.mobile_no);
        localStorage.setItem('country_code', this.country_code);
        this.showInput();
      },
        ({ error, status }) => {
          this.showInput();
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
