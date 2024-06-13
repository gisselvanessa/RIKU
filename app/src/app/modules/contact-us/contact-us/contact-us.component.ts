import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { ContactUsService } from '../contact-us.service';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})

export class ContactUsComponent implements OnInit, OnDestroy {

  contactUsForm: FormGroup;
  contactUsFormControls: any;
  isFormSubmitted: boolean = false;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  isMobileVerification = false;
  mobileNo = '';
  contactUserDetails:any;
  contactFormData: any;

  constructor(
    private contactUsService: ContactUsService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    if (localStorage.getItem('contactDetails')) {
      this.contactUserDetails = JSON.parse(localStorage.getItem('contactDetails')!);
      let message = `I need help with my loan application. It got rejected because my Monthly Expense is $${this.contactUserDetails.monthly_expenses}, which is higher than my Monthly Income of $${this.contactUserDetails.monthly_income}. The vehicle price is $${(this.contactUserDetails.vehicle_price).toLocaleString('es')}, and I have to make a Down Payment of ${this.contactUserDetails.down_payment}%. The loan terms are ${this.contactUserDetails.loan_terms} months, and the Monthly EMI is $${this.contactUserDetails.monthly_EMI}. Can you please assist me in resolving this issue?`;
      message = `Necesito ayuda con mi solicitud de préstamo que fue rechazada, mi gasto mensual es de $${this.contactUserDetails.monthly_expenses.toLocaleString('es', { minimumFractionDigits: 2 })} y mi ingreso mensual de $${this.contactUserDetails.monthly_income.toLocaleString('es', { minimumFractionDigits: 2 })}. El precio del vehículo es de $${this.contactUserDetails.vehicle_price.toLocaleString('es', { minimumFractionDigits: 2 })} y tengo que hacer un Pago Inicial del ${this.contactUserDetails.down_payment}%. El plazo del préstamo que elegí es de ${this.contactUserDetails.loan_terms} meses y el valor de las cuotas mensuales es de $${this.contactUserDetails.monthly_EMI.toLocaleString('es', { minimumFractionDigits: 2 })}. ¿Pueden ayudarme a resolver este problema?`;
      this.contactUsForm = this.fb.group(
        {
          first_name: [this.contactUserDetails.contactDetails.first_name,
          [
            Validators.required,
            Validators.minLength(3),
            //SpaceValidator.cannotContainSpace,
          ],
          ],
          last_name: [this.contactUserDetails.contactDetails.last_name,
          [
            Validators.required,
            Validators.minLength(3),
            // SpaceValidator.cannotContainSpace,
          ],
          ],
          email: [
            this.contactUserDetails.contactDetails.email,
            [
              Validators.required,
              Validators.pattern(
                /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/
              ),
            ],
          ],
          mobile_no: [this.contactUserDetails.contactDetails.country_code + this.contactUserDetails.contactDetails.mobile_no],
          subject: [this.translate.instant('Request for Loan Application'), [Validators.required]],
          message: [message, [Validators.required]],
        }
      );
    } else {
      this.contactUsForm = this.fb.group(
        {
          first_name: ['',
            [
              Validators.required,
              Validators.minLength(3),
              //SpaceValidator.cannotContainSpace,
            ],
          ],
          last_name: ['',
            [
              Validators.required,
              Validators.minLength(3),
              // SpaceValidator.cannotContainSpace,
            ],
          ],
          email: [
            '',
            [
              Validators.required,
              Validators.pattern(
                /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/
              ),
            ],
          ],
          mobile_no: [''],
          subject: ['', [Validators.required]],
          message: ['', [Validators.required]],
        }
      );
    }
    //set the from controls to forms
    this.contactUsFormControls = this.contactUsForm.controls;
  }

  formatNumber(event: any) {
    let current: string = event.target.value;
    current = current.replace(/[^\d-+ ]/g, '');
    this.contactUsFormControls['mobile_no'].setValue(current);
  }

  clearCountrySearchBox() {
    const inputElement = document.getElementById("country-search-box") as HTMLInputElement;
    if (inputElement && inputElement.value) {
      inputElement.value = '';
    }
  }

  submit() {
    this.isFormSubmitted = true;
    if (this.contactUsForm.invalid) {
      this.contactUsForm.markAllAsTouched();
      return;
    }
    this.contactFormData = { ...this.contactUsForm.value };
    if(this.contactFormData.mobile_no && this.contactFormData.mobile_no.dialCode){
      this.contactFormData.country_code = this.contactFormData.mobile_no.dialCode;
      this.contactFormData.mobile_no = this.contactFormData.mobile_no.number.includes(this.contactFormData.country_code) ? this.contactFormData.mobile_no.number.replace(this.contactFormData.country_code, "") : this.contactFormData.mobile_no.number;
      this.contactFormData.mobile_no = this.contactFormData.mobile_no.replaceAll(/\s/g, '');
    }else{
      delete this.contactFormData.mobile_no;
    }
    this.contactUsService.submitQuery(this.contactFormData).pipe().subscribe({
      next: (response: any) => {
        this.contactUsForm.reset();
        this.isFormSubmitted = false;
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'delete-blog-modal',
        });
        modalRef.componentInstance.contactsuccessBtnText = 'Contact us'
        modalRef.result.then().catch((resp:any)=>{
          if(resp === 'ok'){
            this.contactUserDetails = {}
            localStorage.removeItem('contactDetails')
          }
        })
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    });
  }

  ngOnDestroy(): void {
    if(localStorage.getItem('contactDetails')){
      localStorage.removeItem('contactDetails')
    }
  }
}
