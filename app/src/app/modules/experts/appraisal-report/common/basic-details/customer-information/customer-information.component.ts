import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { ExpertsService } from 'src/app/modules/experts/experts.service';

import { Error } from 'src/app/shared/models/error.model';
import { AccordianName } from '../../../report.mode';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.scss']
})
export class CustomerInformationComponent implements OnInit {

  constructor(private expertService: ExpertsService, private toastr: ToastrService,
    private fb: FormBuilder, private translate: TranslateService) { }

  @Input() selectAccordian: string;
  @Output() selectedAccordian: EventEmitter<any> = new EventEmitter();
  @Input() expertReviewId: string;
  @Input() statusOfReview:string;
  @Output() saveData: EventEmitter<any> = new EventEmitter();
  @Input() stepsCompleted: any;
  accordianOpen = false;
  accordianName = AccordianName;
  loading: boolean = false;
  customerInformation: any;
  customerInfoForm: FormGroup;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  latitude: number;
  longitude: number;

  ngOnInit(): void {
  }

  getCustomerDetails() {
    this.loading = true;
    this.expertService.getAppointmentDetails(this.expertReviewId).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.customerInformation = resp.data.contact_info;
      },
      error: (errorRes: Error) => {
        this.loading = false;
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    })
  }

  customerForm() {
    const mobileNumber = this.customerInformation.mobile_no
    this.customerInfoForm = this.fb.group({
      full_name: [this.customerInformation.full_name],
      cedula_id: [this.customerInformation.cadula_id],
      email: [this.customerInformation.email],
      mobile_no: [mobileNumber],
      address: [this.customerInformation.location.address],
      parish: [this.customerInformation.location.parish],
      city: [this.customerInformation.location.city],
      province: [this.customerInformation.location.province],
      current_step: ['CUSTOMER_INFO']
    })

    this.customerInfoForm.get('mobile_no')?.disable()
  }


  sendData() {
    let formData: any = {}
    formData.full_name = this.customerInfoForm.value.full_name
    formData.cedula_id = this.customerInfoForm.value.cedula_id
    formData.email = this.customerInfoForm.value.email
    formData.mobile_no = this.customerInformation.mobile_no
    formData.country_code = this.customerInformation.country_code
    formData.address = this.customerInformation.location
    formData.current_step = this.customerInfoForm.value.current_step

    this.saveData.emit(formData);
  }



  selectedAccordians() {
    this.accordianOpen = !this.accordianOpen;
    const accordianName = this.accordianOpen ? this.accordianName.CustomerInformation : null;
    this.selectedAccordian.emit(accordianName)
    this.getCustomerDetails()
    setTimeout(() => {
      this.customerForm()
    }, 1000);

  }

  clearCountrySearchBox() {
    const inputElement = document.getElementById("country-search-box") as HTMLInputElement;
    if (inputElement && inputElement.value) {
      inputElement.value = '';
    }
  }

}
