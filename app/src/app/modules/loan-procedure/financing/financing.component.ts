import { LabelType, Options } from '@angular-slider/ngx-slider';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { LoanConstansts } from '../loan-constants';
import { VehicleTypes } from 'src/app/shared/constant/add-vehicle-constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-financing',
  templateUrl: './financing.component.html',
  styleUrls: ['./financing.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FinancingComponent implements OnInit {
  vehicleTypes = [{ id: 'automobiles', value: 'Automobiles' }, { id: 'heavy', value: 'Heavy' }, { id: 'buses', value: 'Buses' }, { id: 'work_machinery', value: 'Work Machinery' }]
  selectedVehicleType: string = 'Automobiles';
  selectedVehicleTypeId: string = 'automobiles';
  selectedLoanType: string = 'variable';

  depositeSliderOptions: Options = {
    floor: 0,
    ceil: 100,
    step: 100,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '$' + Intl.NumberFormat("es").format(value);
        case LabelType.High:
          return '$' + Intl.NumberFormat("es").format(value);
        default:
          return '$' + Intl.NumberFormat("es").format(value);
      }
    },
    enforceStep: false,
    enforceRange: false,
  };

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


  minDepositAmount: number = 0;
  maxDepositAmount: number = 0;
  month:any = this.translate.instant("Month")
  months:any = this.translate.instant("Months")
  emiMonthOptions: Options = {
    floor: LoanConstansts.MIN_EMI_MONTH,
    ceil: LoanConstansts.MAX_EMI_MONTH,
    step: 1,
    translate: (value: number, label: LabelType): string => {
      return value == 1 ? value + ` ${this.month}`  : value + ` ${this.months}` ;
    }
  }
  minEMIMonth: number = 1;
  totalEMI: number = 1;
  loanAmount: number;
  vehicleDetail: any;
  loanInterestRest: number;
  monthlyEMIValue: number = 0;
  depositAmount: number = 0;
  vehicleDetails: any;
  vehiclePrice: number = 0;
  price: number = 0;
  termsModal: any;
  depositePercentage: number = 0;
  @ViewChild('terms') openTC: TemplateRef<any>;
  userType:string
  constructor(private modalService: NgbModal, private location: Location,private userService:UserService, private router: Router,private translate:TranslateService) {

   }

  ngOnInit(): void {
    this.userType = this.userService.getUserType()
    this.setLoanInterestRate();
  }

  openTerms() {
    this.termsModal = this.modalService.open(this.openTC, { size: 'lg', backdrop: 'static', centered: true })
  }

  // formatPrice(event: any) {
  //   if(event.target.value && event.target.value.trim() != ''){

  //     // this.basicDetailsForm.get('price')?.setValue(value);
  //   }
  // }


  formatDepositePercentage(event: any) {
    if (event.target.value) {
      // let value = event.target.value.replace(/,/g, '');
      // value = parseFloat(value).toLocaleString('en-US', {
      //   style: 'decimal'
      // });
      // const mileageValue = event.target.value;
      // const decimalPoint = ",";
      // const position = 8;
      // if (mileageValue.length > 8 && !mileageValue.includes(decimalPoint)) {
      //   const modifiedMileageValue: any = [mileageValue.slice(0, position), decimalPoint, mileageValue.slice(position)].join('');
      //   this.price = modifiedMileageValue;
      // } else {
      //   this.price = event.target.value
      // }
      let value = event.target.value.replace(/,/g, '');
      value = parseFloat(value).toLocaleString('es');
      this.price = value;
      if(value){
        let vehiclePrice = value.replaceAll('.', '');
        this.vehiclePrice = vehiclePrice.replaceAll(',', '.');
      }
      this.minDepositAmount = ((LoanConstansts.MIN_DEPOSIT / 100) * this.vehiclePrice);
      this.maxDepositAmount = ((LoanConstansts.MAX_DEPOSIT / 100) * this.vehiclePrice);
      this.depositAmount = this.minDepositAmount;
      this.depositeSliderOptions = { ...this.depositeSliderOptions, minLimit: this.minDepositAmount, maxLimit: this.maxDepositAmount, floor: 0, ceil: this.vehiclePrice }
    } else {
      this.vehiclePrice = 0;
      this.depositAmount = 0;
      this.depositeSliderOptions = { ...this.depositeSliderOptions, minLimit: this.minDepositAmount, maxLimit: this.maxDepositAmount, floor: 0, ceil: this.vehiclePrice }
    }
    if(this.totalEMI == 0 ||  this.depositePercentage == 0){
      this.totalEMI = 1;
      this.depositePercentage = LoanConstansts.MIN_DEPOSIT;
    }
    this.calculateEMI();
  }

  setLoanInterestRate(vehicleType: string = '') {
    switch (vehicleType) {
      case VehicleTypes.Automobiles:
        this.emiMonthOptions = {...this.emiMonthOptions, ceil: LoanConstansts.MAX_AUTOMOBILE_EMI_MONTH};
        this.loanInterestRest = LoanConstansts.CAR_AUTOMOBILE_INTEREST_RATE;
        break;
      case VehicleTypes.WorkMachinery:
        this.emiMonthOptions = {...this.emiMonthOptions, ceil: LoanConstansts.MAX_EMI_MONTH};
        this.loanInterestRest = LoanConstansts.HEAVY_VEHICLE_INTEREST_RATE;
        break;
      case VehicleTypes.Buses:
        this.emiMonthOptions = {...this.emiMonthOptions, ceil: LoanConstansts.MAX_EMI_MONTH};
        this.loanInterestRest = LoanConstansts.HEAVY_VEHICLE_INTEREST_RATE;
        break;
      case VehicleTypes.Heavy:
        this.emiMonthOptions = {...this.emiMonthOptions, ceil: LoanConstansts.MAX_EMI_MONTH};
        this.loanInterestRest = LoanConstansts.HEAVY_VEHICLE_INTEREST_RATE;
        break;
      default:
        this.emiMonthOptions = {...this.emiMonthOptions, ceil: LoanConstansts.MAX_AUTOMOBILE_EMI_MONTH};
        this.loanInterestRest = LoanConstansts.CAR_AUTOMOBILE_INTEREST_RATE;
        break;
    }
    this.calculateEMI(this.depositePercentage, 'deposit');
  }


  selectValue(event: any, value: any) {
    this.selectedVehicleTypeId = event.target.id
    this.selectedVehicleType = value;
    this.setLoanInterestRate(this.selectedVehicleType);
  }

  calculateEMI(value: number = 0, valueOf: string = '') {
    // if (valueOf === 'deposit_amount') {
    //   this.depositAmount = value;
    //   depositAmount = this.depositAmount;
    // }
    if (valueOf === 'deposit') {
      this.depositePercentage = value;
    }
    else if (valueOf === 'emi_months') {
      this.totalEMI = value;
    }
    const depositAmount = (this.depositePercentage / 100) * this.vehiclePrice;
    this.loanAmount = this.vehiclePrice - depositAmount;
    this.loanAmount = this.vehiclePrice - this.depositAmount;
    this.monthlyPayment((this.loanInterestRest / 100), this.totalEMI, this.loanAmount);
      // var outstandingAmount = Number(this.loanAmount) + Number(this.loanAmount * (11 / 100) * this.totalEMI);
      // const monthlyEMI = outstandingAmount / this.totalEMI;
      // this.monthlyEMIValue = monthlyEMI;
      // console.log('Rushabh EMI', monthlyEMI);
      //const monthlyEMIValue = this.pmt(this.loanInterestRest / 12, this.totalEMI, - this.loanAmount, 0, 0);
      // if (loanType === 'variable') return this.loanAmount / this.totalEMI + this.loanAmount * (this.loanInterestRest / 12);
      // return 0;
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

  formatToNumber(event: any) {
    if (event.target.value && event.target.value.trim() != '') {
      let value = event.target.value.replaceAll('.', '');
      value = value.replaceAll(',', '.');
      this.price = value;
      this.vehiclePrice = value;
    }
  }

  back() {
    this.location.back()
  }

  selectLoanType(laonType: string){
    this.selectedLoanType = laonType;
    this.calculateEMI();
  }

  viewAllVehicles(){
    if(this.vehiclePrice && this.vehiclePrice > 0){
      localStorage.setItem('max_vehicle_price', this.vehiclePrice.toString());
    }
    this.router.navigate([`/${this.userType}/vehicles`]);
  }
}
