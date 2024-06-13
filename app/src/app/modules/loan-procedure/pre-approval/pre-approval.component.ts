import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LabelType, Options } from '@angular-slider/ngx-slider';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';
import { TranslateService } from '@ngx-translate/core';

import { VehicleDetailsService } from '../../buyers/buyer-vehicle/buyer-vehicle-details/vehicle-details.service';
import { LoanProcedureService } from '../loan-procedure.service';
import { BuyerOrdersService } from '../../buyers/buyer-orders/buyer-orders.service';

import { VehicleTypes } from 'src/app/shared/constant/add-vehicle-constants';
import { LoanConstansts, LOAN_TYPES, PreApprovalStatus } from '../loan-constants';
import { OrderStages } from 'src/app/shared/constant/add-order-constants';
import { VehicleDetail } from 'src/app/shared/models/vehicle.model';
import { isValidCedulaId } from '../loan-helper';
import { Error } from 'src/app/shared/models/error.model';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-pre-approval',
  templateUrl: './pre-approval.component.html',
  styleUrls: ['./pre-approval.component.scss']
})
export class PreApprovalComponent implements OnInit {

  @ViewChild('verifyCedulaModal') verifyCedulaModal: TemplateRef<any>;
  @ViewChild('preApprovalSuccessModal') preApprovalSuccessModal: TemplateRef<any>;
  @ViewChild('rejectionModal') rejectionModal: TemplateRef<any>;
  @ViewChild('notApplicable') notApplicable: TemplateRef<any>;
  @ViewChild(NgOtpInputComponent, { static: false }) ngOtpInput: NgOtpInputComponent;
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: ''
  };


  loading: boolean = false;
  minDepositAmount: number = 0;
  maxDepositAmount: number = 0;
  depositePercentage: number = 0;
  cedulaOTP: number;
  vehicleTypes = VehicleTypes;
  depositeOptions: Options = {
    floor: 30,
    ceil: 95,
    step: 1,
    translate: (value: number, label: LabelType): string => {
      return value + '%';
      // switch (label) {
      //   case LabelType.Low:
      //     return value + '%';
      //   case LabelType.High:
      //     return Intl.NumberFormat("es").format(value) + '%';
      //   default:
      //     return Intl.NumberFormat("es").format(value) + '%';
      // }
    }
  }
  month:any = this.translate.instant("Month")
  months:any = this.translate.instant("Months")
  emiMonthOptions: Options = {
    floor: LoanConstansts.MIN_EMI_MONTH,
    ceil: LoanConstansts.MAX_EMI_MONTH,
    step: 1,
    translate: (value: number, label: LabelType): string => {
      return value == 1 ? value + ` ${this.month}`  : value + ` ${this.months}` ;
      // switch (label) {
      //   case LabelType.Low:
      //     return Intl.NumberFormat("es").format(value);
      //   case LabelType.High:
      //     return Intl.NumberFormat("es").format(value);
      //   default:
      //     return Intl.NumberFormat("es").format(value);
      // }
    }
  }
  formSubmittted: boolean = false;
  loanInterestRest: number = 0;
  loanAmount: number = 0;
  monthlyEMIValue: number = 0;
  totalEMI: number = 1;
  vehicleId: string;
  vehicleDetails: VehicleDetail;
  preApprovalForm: FormGroup;
  preApprovalFormControls: any;
  depositAmount: number = 0;
  loanTypes = LOAN_TYPES;
  isValidCedula: boolean = true;
  modalRef: any;
  loanId: string;
  maritalOptions = [{ id: 'single', value: 'Single' }, { id: 'married', value: 'Married' }, { id: 'widow_or_widower', value: 'Widow/Widower' }, { id: 'divorced', value: 'Divorce' }, { id: 'separated', value: 'Separated' }];
  selectedStatus: string;
  loanType: string;
  selectedLoanType: string = 'variable';
  constructor(private vehicleDetailsService: VehicleDetailsService, private toastr: ToastrService,
    private fb: FormBuilder, private _location: Location, private modalService: NgbModal, private router: Router,
    private buyerOrdersService: BuyerOrdersService, private userService:UserService, private loanProcedureService: LoanProcedureService, private translate: TranslateService) { }

  ngOnInit(): void {
    // if (!this.userService.isFromMobile) {
    //   this.vehicleDetails = this.vehicleDetailsService.currentVehicle;
    // }
    this.vehicleDetails = this.vehicleDetailsService.currentVehicle;
    if (!this.vehicleDetails) {
      this.vehicleId = localStorage.getItem('current_vehicle_id') || '';
      if (this.vehicleId && this.vehicleId != '') {
        this.getVehicleDetails();
      }
    } else {
      this.vehicleId = this.vehicleDetails.id;
      this.vehicleDetails.other_img_urls = this.vehicleDetails.other_img_urls.slice(0, 4);
      this.setLoanInterestRate(this.vehicleDetails.vehicle_type);
    }
    this.createForm();
  }

  createForm() {
    this.preApprovalForm = this.fb.group(
      {
        vehicle_id: [this.vehicleId, [Validators.required]],
        cedula_id: ['', [Validators.required]],
        loan_type: ['', [Validators.required]],
        total_household_income: ['', [Validators.required]],
        total_household_expenses: ['', [Validators.required]],
        marital_status: ['', [Validators.required]],
        number_of_emi: [24, [Validators.required]],
        is_grace_period: [false],
        grace_period: ['']
      });
    this.preApprovalFormControls = this.preApprovalForm.controls;
  }

  getVehicleDetails() {
    this.loading = true;
    this.vehicleDetailsService.getVehicleDetails(this.vehicleId)
      .pipe().subscribe(
        (response: any) => {
          this.loading = false;
          this.vehicleDetails = response.data;
          this.vehicleDetails.other_img_urls = this.vehicleDetails.other_img_urls.slice(0, 4);
          this.setLoanInterestRate(this.vehicleDetails.vehicle_type);
        },
        ({ error, status }) => {
          this.loading = false;
          if (error.error[0]) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }
      );
  }

  setLoanInterestRate(vehicleType: string) {
    switch (vehicleType) {
      case VehicleTypes.Automobiles:
        this.emiMonthOptions = { ...this.emiMonthOptions, ceil: LoanConstansts.MAX_AUTOMOBILE_EMI_MONTH };
        this.loanInterestRest = LoanConstansts.CAR_AUTOMOBILE_INTEREST_RATE;
        break;
      case VehicleTypes.WorkMachinery:
        this.loanInterestRest = LoanConstansts.HEAVY_VEHICLE_INTEREST_RATE;
        break;
      case VehicleTypes.Buses:
        this.loanInterestRest = LoanConstansts.HEAVY_VEHICLE_INTEREST_RATE;
        break;
      case VehicleTypes.Heavy:
        this.loanInterestRest = LoanConstansts.HEAVY_VEHICLE_INTEREST_RATE;
        break;
      default:
        this.emiMonthOptions = { ...this.emiMonthOptions, ceil: LoanConstansts.MAX_AUTOMOBILE_EMI_MONTH };
        this.loanInterestRest = LoanConstansts.CAR_AUTOMOBILE_INTEREST_RATE;
        break;
    }
    this.totalEMI = 1;
    this.depositePercentage = LoanConstansts.MIN_DEPOSIT;
    this.calculateEMI();
  }

  formatDepositePercentage(event: any) {
    if (event.target.value && event.target.value.length >= 2) {
      let downPayment = event.target.value;
      if (!event.target.value.includes('.') && event.target.value.length > 2) {
        downPayment = event.target.value.slice(0, 2) + '.' + downPayment.slice(2);
      }
      this.preApprovalForm.get("deposit_amount_percentage")?.setValue(downPayment);
    } else if (event.target.value) {
      this.preApprovalForm.get("deposit_amount_percentage")?.setValue(event.target.value);
    }
    this.calculateEMI();
  }

  calculateEMI(value: number = 0, valueOf: string = '') {
    if (this.vehicleDetails) {
      if (valueOf === 'deposit') {
        this.depositePercentage = value;
      }
      else if (valueOf === 'emi_months') {
        this.totalEMI = value;
      }
      this.depositAmount = (this.depositePercentage / 100) * this.vehicleDetails.price;
      this.loanAmount = this.vehicleDetails.price - this.depositAmount;
      this.monthlyPayment((this.loanInterestRest / 100), this.totalEMI, this.loanAmount);
      // var outstandingAmount = Number(this.loanAmount) + Number(this.loanAmount * (11 / 100) * this.totalEMI);
      // const monthlyEMI = outstandingAmount / this.totalEMI;
      // this.monthlyEMIValue = monthlyEMI;
      // console.log('Rushabh EMI', monthlyEMI);
      //const monthlyEMIValue = this.pmt(this.loanInterestRest / 12, this.totalEMI, - this.loanAmount, 0, 0);
      // if (loanType === 'variable') return this.loanAmount / this.totalEMI + this.loanAmount * (this.loanInterestRest / 12);
      // return 0;
    }
  }

  monthlyPayment(interestRate, loanPeriod, loanAmount) {
    if (this.selectedLoanType == 'fixed') {
      this.monthlyEMIValue = this.perMonthEMI(interestRate / 12, loanPeriod, - loanAmount, 0, 0);
    } else {
      this.monthlyEMIValue = loanAmount / loanPeriod + loanAmount * (interestRate / 12);
    }
  }

  perMonthEMI(rate_per_period, number_of_payments, present_value, future_value = 0, type = 0) {
    if (rate_per_period != 0.0) {
      // Interest rate exists
      let q = Math.pow(1 + rate_per_period, number_of_payments);
      return -(rate_per_period * (future_value + q * present_value)) / ((-1 + q) * (1 + rate_per_period * type));
    }
    if (number_of_payments != 0.0) {
      // No interest rate, but number of payments exists
      return -(future_value + present_value) / number_of_payments;
    }
    return 0;
  }

  setLoanType(loan: string) {
    this.preApprovalForm.get("loan_type")?.setValue(loan);
    this.selectedLoanType = loan;
    this.calculateEMI();
  }

  setMaritalStatus(status: string) {
    this.preApprovalForm.get("marital_status")?.setValue(status);
  }

  setGracePeriod(gracePeriod: number) {
    this.preApprovalForm.get("grace_period")?.setValue(gracePeriod);
  }

  back() {
    localStorage.removeItem('current_vehicle_id');
    this._location.back();
  }

  validateCedulaId(event: any) {
    if (event.target.value && event.target.value.length == 10) {
      this.isValidCedula = isValidCedulaId(this.preApprovalForm.value.cedula_id);
    }
  }

  submitPreApproval() {
    this.formSubmittted = true;
    const preApprovalData = { ...this.preApprovalForm.value };
    this.isValidCedula = true;
    if (preApprovalData.cedula_id) {
      this.isValidCedula = isValidCedulaId(preApprovalData.cedula_id);
    }
    if (this.preApprovalForm.invalid || !this.isValidCedula) {
      return;
    }
    let totalHouseholdIncome = preApprovalData.total_household_income.replaceAll('.', '');
    preApprovalData.total_household_income = totalHouseholdIncome.replaceAll(',', '.');
    let totalHouseholdExpenses = preApprovalData.total_household_expenses.replaceAll('.', '');
    preApprovalData.total_household_expenses = totalHouseholdExpenses.replaceAll(',', '.');


    // TODO: remove validation
   /*  if (!((preApprovalData.total_household_income - preApprovalData.total_household_expenses) > this.monthlyEMIValue)) {
      // this.toastr.error('Your monthly saving must be greater than monthly emi amount');
      this.modalRef = this.modalService.open(this.notApplicable, { size: 'md', backdrop: 'static', centered: true });
      return;
    } */

    this.loading = true;
    const data = {
      "vehicle_id": preApprovalData.vehicle_id,
      "deposit_percentage": this.depositePercentage,
      "terms": this.totalEMI,
      "cedula_id": preApprovalData.cedula_id,
      "loan_type": preApprovalData.loan_type,
      "household_income": preApprovalData.total_household_income,
      "household_expense": preApprovalData.total_household_expenses,
      "marital_status": preApprovalData.marital_status,
      "is_grace_period": preApprovalData.is_grace_period,
      "grace_period": (!preApprovalData.grace_period || preApprovalData.grace_period == '') ? null : preApprovalData.grace_period
    }
    this.loanProcedureService.getPreApproval(data)
      .pipe().subscribe(
        (response: any) => {
          this.loading = false;
          this.openModal(response);
        },
        ({ error, status }) => {
          this.loading = false;
          if (error.error[0]) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }
      );

  }

  openModal(loanResponse: any) {
    switch (loanResponse.success_code) {
      case PreApprovalStatus.NOT_ELIGIBLE_FOR_LOAN:
        this.modalRef = this.modalService.open(this.rejectionModal, { size: 'md', backdrop: 'static', centered: true });
        break;
      case PreApprovalStatus.CEDULA_ID_VERIFICATION:
        this.modalRef = this.modalService.open(this.verifyCedulaModal, { size: 'md', backdrop: 'static', centered: true });
        break;
      case PreApprovalStatus.LOAN_APPLICATION_CREATED:
        this.loanId = loanResponse.data.id;
        this.modalRef = this.modalService.open(this.preApprovalSuccessModal, { size: 'md', backdrop: 'static', centered: true });
        break;
      default:
        this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        break;
    }
  }

  verifyCedulaId() {
    this.loading = true;
    this.loanProcedureService.getPreApproval({ loan_id: '', otp: this.cedulaOTP })
      .pipe().subscribe(
        (response: any) => {
          this.loading = false;
          this.modalRef.close();
        },
        ({ error, status }) => {
          this.loading = false;
          if (error.error[0]) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }
      );
  }

  formatPrice(event: any, key: string) {
    if (event.target.value && event.target.value.trim() != '' && !isNaN(event.target.value.trim())) {
      let value = event.target.value.replace(/,/g, '');
      value = Intl.NumberFormat('es').format(value);
      this.preApprovalForm.get(key)?.setValue(value);
    }else{
      this.preApprovalForm.get(key)?.setValue(0);
    }
  }

  formatToNumber(event: any, key: string) {
    if (event.target.value && event.target.value.trim() != '') {
      let value = event.target.value.replaceAll('.', '');
      value = value.replaceAll(',', '.');
      this.preApprovalForm.get(key)?.setValue(value);
    }else{
      this.preApprovalForm.get(key)?.setValue(0);
    }
  }

  onOtpChange(otp: any) {
    this.cedulaOTP = otp;
  }

  contactAdmin() {
    this.modalRef.close();
    this.userService.getMyProfileDetails().subscribe({next :(res:any)=>{
      let userDetails :any = {
        contactDetails : res.data,
        monthly_EMI:this.monthlyEMIValue,
        vehicle_price:this.vehicleDetails.price,
        down_payment : this.depositePercentage,
        loan_terms : this.totalEMI,
        monthly_income:this.preApprovalForm.value.total_household_income,
        monthly_expenses:this.preApprovalForm.value.total_household_expenses
      }
      localStorage.setItem('contactDetails',JSON.stringify(userDetails))
    },error:(errorRes:Error) =>{
      const error = errorRes.error;
          this.loading = false;
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
    }

  })
    setTimeout(() => {
      this.router.navigate(['/contact-us']);
    }, 800);

  }

  public buyNow() {
    this.loading = true;
    this.buyerOrdersService.postOrder({ vehicle_id: this.vehicleId, current_stage: OrderStages.PLACED })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.modalRef.close();
          localStorage.setItem('current_order_id', res.data.order_id);
          this.router.navigate([`/user/buyer-orders/add-order/${res.data.order_id}`]);
        },
        error: (errorRes: Error) => {
          const error = errorRes.error;
          this.loading = false;
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }
      });
  }

  public completeApplication() {
    this.modalRef.close();
    localStorage.setItem('current_loan_id', this.loanId);
    this.router.navigate(['/loan/loan-candidate-details']);
  }

  public selectCheckbox(event: Event) {
    event.preventDefault(); // Evitar la acción predeterminada del enlace
    this.preApprovalFormControls.is_grace_period.value = !this.preApprovalFormControls.is_grace_period.value;
  }
}
