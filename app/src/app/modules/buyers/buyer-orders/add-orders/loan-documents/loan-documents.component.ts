import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Order } from '../../buyer-order.model';
import { LoanStatus, MandatoryLoanDocuments } from 'src/app/shared/constant/loan-constants';
import { OrderStepsNumber } from 'src/app/shared/constant/add-order-constants';
import { Error } from 'src/app/shared/models/error.model';
import { LoanProcedureService } from 'src/app/modules/loan-procedure/loan-procedure.service';
import { ApplicationReviewAccordianName } from 'src/app/modules/loan-procedure/loan-candidate-details/accordian.model';


@Component({
  selector: 'app-loan-documents',
  templateUrl: './loan-documents.component.html',
  styleUrls: ['./loan-documents.component.scss']
})

export class LoanDocumentsComponent implements OnInit {


  @Input() currentStep: number;
  @Output() onSubmitDetails: EventEmitter<{ orderDetail: Order, nextStep: number }> = new EventEmitter();
  @Input() currentOrder: Order = new Order();
  accordianName = ApplicationReviewAccordianName;
  selectedAccordian: string = this.accordianName.APPLICANT_DOCUMENTS;
  applicantDocuments: any = {};
  coApplicantDocuments: any = {};
  loanDetail: any;
  isOpened: boolean = true;
  vehicleInfo: any;
  applicantInfo: any;
  coApplicantInfo: any;
  referenceInfo: any;
  sliderImages: Array<any> = [];
  acceptTermsAndCondition: boolean;
  mandatoryLoanDocuments = MandatoryLoanDocuments;
  loanStatus = LoanStatus;
  loading: boolean = false;

  constructor(private loanProcedureService: LoanProcedureService, private toastr: ToastrService,
    private translate: TranslateService, private router: Router) { }

  ngOnInit(): void {
    this.getLoanDetail(this.currentOrder.loan.id);
  }

  getLoanDetail(loanId: string) {
    this.loading = true;
    this.loanProcedureService.loanDetails(loanId).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.loanDetail = res.data;
        this.loanDetail.documents.forEach((document: any) => {
          if (document.is_co_applicant_document) {
            this.coApplicantDocuments[document.name] = document;
          } else {
            this.applicantDocuments[document.name] = document;
          }
        });
      },
      error: (errorRes:Error) => {
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

  selectAccordian(accordian: string, i: number) {
    if (this.selectedAccordian != accordian) {
      this.selectedAccordian = accordian;
      this.isOpened = true;
    } else {
      this.isOpened = !this.isOpened;
      this.selectedAccordian = ''
    }
  }

  setNextStep(): void {
    const currentStage: any = this.currentOrder.current_stage.toUpperCase();
    const completedStep: any = this.orderCurrentStepNumber[currentStage];
    if (this.loanDetail.is_all_documents_verified) {
      if (completedStep > OrderStepsNumber.LOAN) {
        this.goToNextStep();
      } else {
        this.loading = true;
        this.loanProcedureService.setLoanForOrder(this.currentOrder.order_id).subscribe({
          next: (res: any) => {
            this.loading = false;
            this.goToNextStep();
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
    }else{
      this.toastr.error(this.translate.instant("You can not proceed further until admin verifies all the documnents"));
    }
  }

  goToNextStep(){
    const nextStep =  OrderStepsNumber.VEHICLE_PROCEDURE;
    this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: nextStep });
  }

  setPreviousStep(): void {
    this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.BUY_NOW });
  }

  backOrderList(){
    this.router.navigate([`/user/buyer-orders/order-list`])
  }

  updateLoanSummary(event: any) {
    // throw new Error('Method not implemented.');
  }

  viewLoanDetails(){
    localStorage.setItem('current_loan_id',  this.currentOrder.loan.id);
    this.router.navigate(['/loan/loan-candidate-details'])
  }

  public get orderCurrentStepNumber(): typeof OrderStepsNumber {
    return OrderStepsNumber;
  }

}
