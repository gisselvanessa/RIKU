import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LoanProcedureService } from '../../loan-procedure.service';
import { LoanStages, LoanStepsNumber } from 'src/app/shared/constant/loan-constants';
import { Error } from 'src/app/shared/models/error.model';

@Component({
  selector: 'app-personal-reference',
  templateUrl: './personal-reference.component.html',
  styleUrls: ['./personal-reference.component.scss']
})
export class PersonalReferenceComponent implements OnInit, AfterViewChecked, AfterViewInit {

  constructor(private location: Location, private translate: TranslateService, private fb: FormBuilder, private toastr: ToastrService, private loanProcedureService: LoanProcedureService, private render: Renderer2, private ngZone: NgZone,) { }

  @ViewChild('address') address: any;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  @Input() currentStep: number;
  @Input() currentLoanDetail: any;
  @Output() onSubmitApplicantDetails: EventEmitter<{ loanDetail: any, nextStep: number }> = new EventEmitter();
  @Input() currentLoanId: any;

  personalReferenceForm: FormGroup;
  isSubmitted: boolean = false;



  referenceTypes = [{ id: 'dad', value: 'Dad' }, { id: 'mom', value: 'Mom' }, { id: 'brother', value: 'Brother' }, { id: 'sister', value: 'Sister' }, { id: 'uncle', value: 'Uncle' }, { id: 'aunt', value: 'Aunt' }, { id: 'female_cousin', value: 'Female Cousin' }, { id: 'male_cousin', value: 'Male Cousin' }, { id: 'grand_father', value: 'Grand Father' }, { id: 'grand_mother', value: 'Grand Mother' }, { id: 'friend', value: 'Friend' }, { id: 'neighbor', value: 'Neighbor' }, { id: 'god_father', value: 'Godfather' }]
  selectedReference: any;
  selectedReferenceId: any;


  ngOnInit(): void {
    this.createForm()
    this.currentLoanId = this.currentLoanDetail.id

  }


  ngAfterViewInit(): void {
    this.placeOfWork();
  }

  createForm() {
    if (this.currentLoanDetail.reference_info != null) {
      const referenceInfo = this.currentLoanDetail.reference_info;
      this.personalReferenceForm = this.fb.group({
        full_name: [referenceInfo.full_name, Validators.required],
        address: [referenceInfo.address, Validators.required],
        province: [''],
        city: [''],
        parish: [''],
        mobile_no: [null],
        reference_type: [referenceInfo.reference_type, Validators.required]
      })

      if(referenceInfo.country_code && referenceInfo.mobile_no){
        this.personalReferenceForm.controls['mobile_no'].setValue(referenceInfo.country_code + referenceInfo.mobile_no)
      }
      const referenceIndex = this.referenceTypes.findIndex((resp: any) => resp.id == referenceInfo.reference_type)
      this.selectedReference = this.referenceTypes[referenceIndex].value
      this.selectedReferenceId = referenceInfo.reference_type
    } else {
      this.personalReferenceForm = this.fb.group({
        full_name: ['', Validators.required],
        address: ['', Validators.required],
        province: [''],
        city: [''],
        parish: [''],
        mobile_no: [null],
        reference_type: ['', Validators.required]
      })
    }

  }


  private placeOfWork() {
    let autocomplete: google.maps.places.Autocomplete;
    autocomplete = new google.maps.places.Autocomplete(this.address?.nativeElement, {
      componentRestrictions: { country: ["ec"] },
      fields: ["address_components", "formatted_address", "geometry"],
      types: ["address"],
    });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: any = autocomplete.getPlace();
        this.fillInPlaceOfWork(place, true);
      });
    });
  }


  public fillInPlaceOfWork(place: any, isAddress: boolean = false) {

    try {
      //Reference Url:  https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
      let address1 = "";
      let province = '';
      let city = '';
      let parish = '';
      let country = '';
      for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
        const componentType = component.types[0];
        switch (componentType) {
          case "street_address": {
            address1 += `${component.long_name}`;
            break;
          }
          case "point_of_interest": {
            address1 += `${component.long_name}`;
            break;
          }
          case "establishment": {
            address1 += `${component.long_name}`;
            break;
          }
          case "street_number": {
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          }
          case "route": {
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          }
          case "sublocality_level_3":
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          case "sublocality_level_2":
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          case "sublocality_level_1":
            parish = component.long_name;
            if (isAddress) {
              this.personalReferenceForm.controls['parish'].setValue(parish);
            }
            break;
          case "sublocality":
            parish = component.long_name;
            if (isAddress) {
              this.personalReferenceForm.controls['parish'].setValue(parish);
            }
            break;
          case "locality":
            city = component.long_name;
            if (isAddress) {
              this.personalReferenceForm.controls['city'].setValue(city);
            }
            break;
          case "administrative_area_level_1":
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            province = component.long_name;
            if (isAddress) {
              this.personalReferenceForm.controls['province'].setValue(province);
            }
            break;
          case "administrative_area_level_2":
            province = component.long_name;
            if (isAddress) {
              this.personalReferenceForm.controls['province'].setValue(province);
            }
            break;
          case "political":
            province = component.long_name;
            if (isAddress) {
              this.personalReferenceForm.controls['province'].setValue(province);
            }
            break;
          case "country":
            if (isAddress) {
              country = component.long_name;
            }
            break;
        }
      }
      if (parish != '') {
        address1 += ',' + parish;
      }
      if (city != '') {
        address1 += ',' + city;
      }
      if (province != '') {
        address1 += ',' + province;
      }
      if (country != '') {
        address1 += ',' + country;
      }
      isAddress ? this.personalReferenceForm.controls['address'].patchValue(address1) : this.personalReferenceForm.controls['address'].setValue(address1);
    } catch (ex) {
    }
  }


  selectValue(event: any, value: any) {
    this.selectedReferenceId = event.target.id
    this.selectedReference = value
    this.personalReferenceForm.controls['reference_type'].setValue(this.selectedReferenceId)
  }


  ngAfterViewChecked(): void {
    const getElement: ElementRef | any = document.querySelector(`ngx-intl-tel-input .search-container input`);
    if (getElement && !getElement.getAttribute('autocomplete')) {
      this.render.setAttribute(getElement, 'autocomplete', 'none');
      this.render.setAttribute(getElement, 'type', 'search');
    }
  }


  clearCountrySearchBox() {
    const inputElement = document.getElementById("country-search-box") as HTMLInputElement;
    if (inputElement && inputElement.value) {
      inputElement.value = '';
    }
  }

  sendPersonalReference() {
    this.isSubmitted = true;
    if (this.personalReferenceForm.invalid) {
      const message = this.translate.instant("Please fill all the fields")
      this.toastr.warning(message)
    } else {
      let postData: any = {}
      postData.full_name = this.personalReferenceForm.value.full_name
      postData.address = this.personalReferenceForm.value.address

      if (this.personalReferenceForm.value.mobile_no) {
        postData.country_code = this.personalReferenceForm.value.mobile_no.dialCode;
        postData.mobile_no = this.personalReferenceForm.value.mobile_no.number.includes(postData.country_code) ? this.personalReferenceForm.value.mobile_no.number.replace(postData.country_code, "") : this.personalReferenceForm.value.mobile_no.number;
        postData.mobile_no = postData.mobile_no.replaceAll(/\s/g, '');
      }


      postData.reference_type = this.selectedReferenceId

      let sendData: any = {
        current_stage: this.loanCurrentStage.REFERENCE_INFO,
        reference_info: postData,
        id: this.currentLoanId
      }
      this.loanProcedureService.patchLoanDetails(sendData).subscribe({
        next: (resp: any) => {
          this.currentLoanDetail.reference_info = postData
          this.currentLoanDetail.current_stage = this.loanCurrentStage.APPLICATION_REVIEW
          this.onSubmitApplicantDetails.emit({ loanDetail: this.currentLoanDetail, nextStep: LoanStepsNumber.APPLICATION_REVIEW });
        },
        error: (errorRes: Error) => {
          const error = errorRes.error;
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }

      })
    }
  }

  public get loanCurrentStage(): typeof LoanStages {
    return LoanStages;
  }
  setPreviousStep() {

    if (this.currentLoanDetail.applicant_info.is_co_applicant) {
      this.onSubmitApplicantDetails.emit({ loanDetail: this.currentLoanDetail, nextStep: LoanStepsNumber.CO_APPLICANT_INFO });

    } else {
      this.onSubmitApplicantDetails.emit({ loanDetail: this.currentLoanDetail, nextStep: LoanStepsNumber.APPLICANT_INFO });

    }
    //this.scheduleMeetingData.current_stage = this.orderCurrentStage.SCHEDULE_MEETING;
  }

  back() {
    this.location.back()
  }


}
