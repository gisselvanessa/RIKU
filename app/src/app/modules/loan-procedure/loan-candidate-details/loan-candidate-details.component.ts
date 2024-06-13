import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router  } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LoanStepsNumber } from 'src/app/shared/constant/loan-constants';
import { Error } from 'src/app/shared/models/error.model';
import { LoanProcedureService } from '../loan-procedure.service';

@Component({
  selector: 'app-loan-candidate-details',
  templateUrl: './loan-candidate-details.component.html',
  styleUrls: ['./loan-candidate-details.component.scss']
})
export class LoanCandidateDetailsComponent implements OnInit {

  constructor(private location: Location,private toastr:ToastrService,private translate:TranslateService,private router:Router,private loanProcedureService:LoanProcedureService) { }
  currentStep: number;
  loanDetail: any;
  loading: boolean = false;
  loanDetailId:string;
  cedulaId:string;
  @ViewChild('loanStepsWrapper') loanStepsWrapper: ElementRef;

  ngOnInit(): void {
    let currentLoanId = localStorage.getItem('current_loan_id');
    const currentLoan: any = this.loanProcedureService.getCurrentLoan();
    if (currentLoanId) {
      if (currentLoan) {
        if (currentLoan.loan_id != currentLoanId) {
          this.getLoanDetail(currentLoanId);
        } else {
          this.setLoanDetail(currentLoan);
        }
      } else {
        this.getLoanDetail(currentLoanId);
      }
    } else {
      // this.router.navigate(['/loan/loan-candidate-details'])
      this.router.navigate(['/loan/loan-list'])
    }
  }


  getLoanDetail(loanId: string) {
    this.loading = true;
    this.loanProcedureService.loanDetails(loanId).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.setLoanDetail(res.data);
      },
      error: (errorRes:Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
        this.router.navigate(['/loan'])
      }
    });
  }

  setLoanDetail(currentLoan: any) {
    this.loanDetail = currentLoan;
    this.loanDetailId = currentLoan.id
    this.cedulaId = currentLoan.cedula_id
    if (this.loanDetail.current_stage) {
      const orderStage: any = this.loanDetail.current_stage.toUpperCase();
      let currentStep: any = LoanStepsNumber[orderStage];
      // if(currentStep == LoanStepsNumber.BUY_NOW && this.loanDetail.negotiation_details.is_price_negotiating === null){
      //   currentStep = LoanStepsNumber.PRICE_NEGOTIATION;
      // }
      this.currentStep = currentStep;
      // this.currentStep = LoanStepsNumber.SUMMARY;

    }
  }

  setNextStep(data: any) {
    this.currentStep = data.nextStep;
    if(this.currentStep == 6){
      this.loanDetail = data.loanDetail;
      this.getLoanDetail(this.loanDetail.id)
      localStorage.setItem('current_loan_id',this.loanDetail.id);
    }else{
      this.loanDetail = data.loanDetail;
      localStorage.setItem('current_loan_id',this.loanDetail.id);
    }
    // this.loanStepsWrapper.nativeElement.scrollIntoView();
    window.scrollTo(0,10)
  }

  ngOnDestroy() {
    // TODO: commented to the layout of loan-candidate-details component
    localStorage.removeItem('current_loan_id');
  }

  public get loanCurrentStepNumber(): typeof LoanStepsNumber {
    return LoanStepsNumber;
  }

  back() {
    this.location.back();
  }

}
