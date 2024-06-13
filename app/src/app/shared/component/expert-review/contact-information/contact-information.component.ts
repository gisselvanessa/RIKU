import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ExpertReviewService } from '../expert-review.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Error } from 'src/app/shared/models/error.model';
import { Order } from 'src/app/modules/buyers/buyer-orders/buyer-order.model';
import { ExpertReviewStepsNumber } from 'src/app/shared/constant/add-order-constants';
import { Payment } from '../../../../modules/experts/apoointment.model';
import { isValidCedulaId } from 'src/app/modules/loan-procedure/loan-helper';


@Component({
  selector: 'app-contact-information',
  templateUrl: './contact-information.component.html',
  styleUrls: ['./contact-information.component.scss']
})
export class ContactInformationComponent implements OnInit {


  @Input() currentExpertReviewStep: number;
  @Input() currentOrder: Order;
  @Input() currentExpertReview: any;
  @Output() onSubmitExpertReviewDetails: EventEmitter<{ orderDetail: Order, nextStep: number, expertReviewDetail: any }> = new EventEmitter();
  @ViewChild('additionalAddress') additionalAddress: any;
  contactForm: FormGroup;
  loading: boolean = false;
  submitting: boolean;

  @Input() expertReviewId: any;
  formControls: any;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  latitude: number;
  longitude: number;
  readOnly: boolean = false;
  provinceList: string[] = [];
  cityList:  string[] = [];
  searchProvince: string;
  searchCity: string;
  searchParish: string;
  parishList:  string[] = [];
  isValidCedula: boolean = true;


  constructor(private ngZone: NgZone, private _fb: FormBuilder, private expertEvaluationService: ExpertReviewService, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.getProvinceData();
    this.contactFormControls();


  }


  //set google api's after view init
  ngAfterViewInit(): void {
    // this.__getGoogleAddress();
  }

  contactFormControls() {
    if (this.currentExpertReview.payment?.method) this.readOnly = true;
    if (this.currentExpertReview && this.currentExpertReview.contact_info && this.currentExpertReview.contact_info.full_name) {
      // Please fill details with contact info object
      let formData: any = {}
      formData.fullName = this.currentExpertReview.contact_info.full_name;
      formData.mobileNumber = this.currentExpertReview.contact_info.country_code + '' + this.currentExpertReview.contact_info.mobile_no.replace(this.currentExpertReview.contact_info.country_code, '');
      formData.address = this.currentExpertReview.contact_info.location.address;
      formData.parish = this.currentExpertReview.contact_info.location.parish;
      formData.city = this.currentExpertReview.contact_info.location.city;
      formData.province = this.currentExpertReview.contact_info.location.province;
      formData.email = this.currentExpertReview.contact_info.email;
      formData.cadula_id = this.currentExpertReview.contact_info.cadula_id;
      this.setformControls(formData)
    } else {
      this.expertEvaluationService.getUserDetails().subscribe({
        next: (resp: any) => {
          let formData: any = {}
          formData.fullName = resp.data.first_name + ' ' + resp.data.last_name;
          formData.mobileNumber = resp.data.country_code + '' + resp.data.mobile_no;
          formData.address = resp.data.address.address;
          formData.parish = resp.data.address.parish;
          formData.city = resp.data.address.city;
          formData.province = resp.data.address.province;
          formData.email = resp.data.email;
          formData.cadula_id = null;
          this.setformControls(formData);
          this.formControls = this.contactForm.controls;
        },
        error: (errorRes: Error) => {
          this.loading = false;
          const error = errorRes.error;
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error('Something Went Wrong Please Try again later');
          }
        }
      })
    }

  }

  setformControls(formData: any) {
    this.contactForm = this._fb.group({
      additional_address: [formData.address, Validators.required],
      city: [formData.city, Validators.required],
      province: [formData.province, Validators.required],
      other_address: [],
      parish: [formData.parish, Validators.required],
      cadula_id: [formData.cadula_id, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: [formData.email, [Validators.required, Validators.pattern(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/
      )]],
      mobile_no: [formData.mobileNumber, Validators.required],
      full_name: [formData.fullName, Validators.required],
    });


    this.setProvice(formData?.province);
    this.contactForm.controls['city'].setValue(
      formData?.city
    );
    this.setCity(formData?.city);
    this.contactForm.controls['parish'].setValue(
      formData?.parish
    );
    this.setParish(formData?.parish);

    setTimeout(() => {
      // this.__getGoogleAddress();
      this.formControls = this.contactForm.controls;
    }, 1000);

  }

  validateCedulaId(event: any) {
    if (event.target.value && event.target.value.length == 10) {
      this.isValidCedula = isValidCedulaId(event.target.value);
    }
  }

  previous() {
    this.onSubmitExpertReviewDetails.emit({ orderDetail: this.currentOrder, nextStep: ExpertReviewStepsNumber.FIND_EXPERT_APPRAISER, expertReviewDetail: this.currentExpertReview })
  }

  next() {
    if (this.currentOrder) {
      this.onSubmitExpertReviewDetails.emit({ orderDetail: this.currentOrder, nextStep: ExpertReviewStepsNumber.PAYMENT, expertReviewDetail: this.currentExpertReview })
    } else {
      this.onSubmitExpertReviewDetails.emit({ orderDetail: this.currentOrder, nextStep: ExpertReviewStepsNumber.VEHICLE_INFORMATION, expertReviewDetail: this.currentExpertReview })
    }
  }

  private __getGoogleAddress() {
    let autocomplete: google.maps.places.Autocomplete;
    autocomplete = new google.maps.places.Autocomplete(this.additionalAddress?.nativeElement, {
      componentRestrictions: { country: ["ec"] },
      fields: ["address_components", "formatted_address", "geometry"],
      types: ["address"],
    });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: any = autocomplete.getPlace();
        this.latitude = place.geometry['location'].lat();
        this.longitude = place.geometry['location'].lng();
        this.fillInAddress(place, true);
      });
    });
  }


  public fillInAddress(place: any, isAddress: boolean = false) {
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
            //this.contactForm.controls['parish'].setValue(parish)
          }
          break;
        case "sublocality":
          parish = component.long_name;
          if (isAddress) {
            //this.contactForm.controls['parish'].setValue(parish)
          }
          break;
        case "locality":
          city = component.long_name;
          if (isAddress) {
            //this.contactForm.controls['city'].setValue(city)
            // this.personalInfoFormControls['city'].setValue(city);
          }
          break;
        case "administrative_area_level_1":
          address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
          province = component.long_name;
          if (isAddress) {
            //this.contactForm.controls['province'].setValue(province)
            // this.personalInfoFormControls['province'].setValue(province);
          }
          break;
        case "administrative_area_level_2":
          province = component.long_name;
          if (isAddress) {
            //this.contactForm.controls['province'].setValue(province)
            // this.personalInfoFormControls['province'].setValue(province);
          }
          break;
        case "political":
          province = component.long_name;
          if (isAddress) {
            //this.contactForm.controls['province'].setValue(province)
            // this.personalInfoFormControls['province'].setValue(province);
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
    isAddress ? this.contactForm.controls['additional_address'].setValue(address1) : this.contactForm.controls['other_address'].setValue(address1);
  }

  public submitInformation() {
    this.submitting = true;
    if (!this.isValidCedula) {
      this.isValidCedula = isValidCedulaId(this.contactForm.controls['cadula_id'].value);
    }
    if (this.contactForm.invalid || !this.isValidCedula) {
      return;
    }
    let contactInfo: any;
    if (this.latitude && this.longitude) {
      contactInfo = { expert_review_id: this.currentExpertReview.expert_review_id, full_name: this.contactForm.value.full_name, cadula_id: this.contactForm.value.cadula_id, email: this.contactForm.value.email, mobile_no: this.contactForm.value.mobile_no.number, country_code: this.contactForm.value.mobile_no.dialCode, location: { address: this.contactForm.value.additional_address, city: this.contactForm.value.city, parish: this.contactForm.value.parish, province: this.contactForm.value.province }, lat: this.latitude, lng: this.longitude }
    } else {
      contactInfo = { expert_review_id: this.currentExpertReview.expert_review_id, full_name: this.contactForm.value.full_name, cadula_id: this.contactForm.value.cadula_id, email: this.contactForm.value.email, mobile_no: this.contactForm.value.mobile_no.number, country_code: this.contactForm.value.mobile_no.dialCode, location: { address: this.contactForm.value.additional_address, city: this.contactForm.value.city, parish: this.contactForm.value.parish, province: this.contactForm.value.province } }
    }
    this.expertEvaluationService.postContactInformation(contactInfo).subscribe({
      next: (resp: any) => {
        this.currentExpertReview.contact_info = contactInfo;
        this.next();
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error('Something Went Wrong Please Try again later');
        }
      }
    })
  }

  clearCountrySearchBox() {
    const inputElement = document.getElementById("country-search-box") as HTMLInputElement;
    if (inputElement && inputElement.value) {
      inputElement.value = '';
    }
  }


  setProvice(province: string) {
    this.contactForm.controls['province'].setValue(province)
    this.searchProvince = '';
    this.parishList = [];
    this.contactForm.controls['city'].setValue('');
    this.contactForm.controls['parish'].setValue('');
    this.expertEvaluationService.getCityList(province).subscribe((res) => {
      this.cityList = res.data.cities?.length > 0 ? res.data.cities : [];
    });
  }

  setCity(city: string) {
    this.contactForm.controls['city'].setValue(city);
    this.contactForm.controls['parish'].setValue('');
    this.searchCity = '';
    this.expertEvaluationService.getParishList(city).subscribe((res) => {
      this.parishList = res.data.parishes?.length > 0 ? res.data.parishes : [];
    });
  }

  setParish(parish: string) {
    this.contactForm.controls['parish'].setValue(parish);
    this.searchParish = '';
  }

  getProvinceData(){
    this.expertEvaluationService.getProvinceList().subscribe((resp: any) => {
      this.provinceList = resp.data;
    });
  }
}
