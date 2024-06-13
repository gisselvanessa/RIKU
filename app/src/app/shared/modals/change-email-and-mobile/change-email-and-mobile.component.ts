import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Error } from '../../models/error.model';
import { UpdateEmailMobileNumberService } from '../../services/update-email-mobile-number.service';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-email-and-mobile',
  templateUrl: './change-email-and-mobile.component.html',
  styleUrls: ['./change-email-and-mobile.component.scss']
})
export class ChangeEmailAndMobileComponent implements OnInit {

  @Input() isAdmin: boolean = false;

  //mobile number variables of library
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  newMobile: any;

  //form variables
  changeEmailAndMobile: FormGroup;
  changeEmailAndMobileControls: any;

  //modal variables and popup type
  modalRef:any
  @Input() type: boolean = false;

  userEnteredNumber: any;

  constructor(
    public fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    public activeModal: NgbActiveModal,
    private updateEmailMobileNumberService: UpdateEmailMobileNumberService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {

    if(this.type){
      this.changeEmailAndMobile = this.fb.group({
        type: [this.userService.getUserType()],
        verification_type: ["email"],
        email: [null, [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/)]],
      });
      this.changeEmailAndMobileControls = this.changeEmailAndMobile.controls;
    }else{
      this.changeEmailAndMobile = this.fb.group({
        type: [this.userService.getUserType()],
        verification_type: ["mobile"],
        country_code: [],
        mobile_no: [null, [Validators.required]]
      });
      this.changeEmailAndMobileControls = this.changeEmailAndMobile.controls;
    }
  }


  onSubmit() {
    if (this.changeEmailAndMobile.valid) {
      if(this.type){
        this.sentOTP(this.changeEmailAndMobile.value);
      }else{
        const value: any = { ...this.changeEmailAndMobile.value};
        this.userEnteredNumber = value.mobile_no;
        this.newMobile =  value.mobile_no.number;
        value.country_code = value.mobile_no?.dialCode;
        value.mobile_no = value.mobile_no.number.split(" ").join("").replace(value.mobile_no.dialCode,"");
        this.sentOTP(value);
      }
    }
  }

  sentOTP(value:any){
    const apiEndPoint: any = this.isAdmin ? this.updateEmailMobileNumberService.sendAdminOTP(value) : this.updateEmailMobileNumberService.sendOTP(value);
    apiEndPoint.pipe().subscribe({
      next: () => {
        if (!this.type) {
          value.newMobile = this.userEnteredNumber;
        }
        this.activeModal.close({action: true, editProfileOTP: value});
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

  clearCountrySearchBox(){
    const inputElement = document.getElementById("country-search-box") as HTMLInputElement;
    if(inputElement && inputElement.value){
     inputElement.value ='';
    }
  }


  formatNumber(event:any){
    let current: string = event.target.value;
    current = current.replace(/[^\d-+ ]/g, '');
    this.changeEmailAndMobileControls['mobile_no'].setValue(current);

  }
}
