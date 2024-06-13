import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';;
import { BuyerOrdersService } from 'src/app/modules/buyers/buyer-orders/buyer-orders.service';
import { LoanService } from '../loan.service';
import { LoanStages, LoanStepsNumber } from 'src/app/shared/constant/loan-constants';
import { Error } from 'src/app/shared/models/error.model';
import { ApplicationReviewAccordianName } from 'src/app/modules/loan-procedure/loan-candidate-details/accordian.model';
import { EmployementType, LoanStatus, MandatoryLoanDocuments } from 'src/app/modules/loan-procedure/loan-constants';
import { LoanDocument } from 'src/app/modules/loan-procedure/load-procedure.model';
import { NotApproveDialogComponent } from '../not-approve-dialog/not-approve-dialog.component';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.scss']
})

export class LoanDetailsComponent implements OnInit {

  constructor(private toastr: ToastrService, private translate: TranslateService, private loanService: LoanService,
    private activatedRoute: ActivatedRoute, private buyerOrdersService: BuyerOrdersService,
    private router: Router, public location: Location, private modalService: NgbModal) { }

  loanId: string;
  accordianName = ApplicationReviewAccordianName;
  selectedAccordian: string;
  applicantDocuments: any = {};
  coApplicantDocuments: any = {};
  @Input() isFromSummary: boolean = false;
  @Input() currentStep: number;
  loanDetail: any;
  @Output() onSubmitApplicantDetails: EventEmitter<{ loanDetail: any, nextStep: number }> = new EventEmitter();
  isOpened: boolean = true;
  @Input() currentLoanId: any;
  vehicleInfo: any;
  applicantInfo: any;
  coApplicantInfo: any;
  referenceInfo: any;
  sliderImages: Array<any> = [];
  acceptTermsAndCondition: boolean;
  mandatoryLoanDocuments = MandatoryLoanDocuments;
  loanStatus = LoanStatus;
  loading: boolean = false;
  lendererData: any;
  modalRef: any;
  loanStageNumber = LoanStepsNumber;
  loanCurrentStageNumber: number = 1;

  @ViewChild('avalburoModal') avalburoModal: TemplateRef<any>;

  ngOnInit(): void {
    this.loanId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.getLoanDetail(this.loanId)
  }

  getLoanDetail(loanId: string) {
    this.loading = true;
    this.loanService.getLoanDetails(loanId).subscribe({
      next: (res: any) => {
        this.loading = false;
        if(res.data){
          this.loanDetail = res.data;
          this.vehicleInfo = this.loanDetail.vehicle;
          this.applicantInfo = this.loanDetail.applicant_info;
          if (this.applicantInfo?.is_co_applicant) {
            this.coApplicantInfo = this.loanDetail.co_applicant_info
          }
          this.referenceInfo = this.loanDetail.reference_info;
          if (this.vehicleInfo.other_img_urls?.length > 0) {
            this.sliderImages = this.vehicleInfo.other_img_urls.map((e: any) => e);
          }
          if (this.vehicleInfo.cover_img_url) {
            this.sliderImages.unshift(this.vehicleInfo.cover_img_url);
          }
          if(this.loanDetail.documents?.length > 0){
            this.loanDetail.documents.forEach((document: any) => {
              if (document.is_co_applicant_document) {
                this.coApplicantDocuments[document.name] = document;
              } else {
                this.applicantDocuments[document.name] = document;
              }
            });
          }
          let loanCurrentStage: any = this.loanDetail.current_stage.toUpperCase();;
          loanCurrentStage = this.loanStageNumber[loanCurrentStage];
          this.loanCurrentStageNumber = loanCurrentStage;
        }

      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
        this.router.navigate(['/admin/loans']);
      }
    });
  }

  selectAccordian(accordian: string, i: number) {
    if (this.selectedAccordian != accordian) {
      this.selectedAccordian = accordian;
      this.isOpened = true;
    } else {
      this.isOpened = !this.isOpened;
    }
  }

  setPreviousStep() {
    this.onSubmitApplicantDetails.emit({ loanDetail: this.loanDetail, nextStep: LoanStepsNumber.REFERENCE_INFO });
  }

  agreeTerms(event: any) {
    this.acceptTermsAndCondition = event.target.checked
  }

  public get loanCurrentStage(): typeof LoanStages {
    return LoanStages;
  }

  isAllRequiredDocumentUploaded(): boolean {
    let isUploaded = true;
    // mandatory documents for applicant based on his employement type
    const mandatoryApplicantDocs = this.getMandatoryDocumentsByType(this.loanDetail?.applicant_info?.employment_info.type);
    const applicantDocs = this.loanDetail.documents.filter((x: LoanDocument) => !x.is_co_applicant_document).map((x: LoanDocument) => x.name);
    // check if buyer has uploaded mandatory documents
    mandatoryApplicantDocs.forEach((item: string) => {
      if (!applicantDocs.includes(item)) {
        isUploaded = false;
        return; // This will exit the forEach loop when the value of num is 3.
      }
    });
    if (this.loanDetail.co_applicant_info?.personal_info) {
      const coApplicantDocs = this.loanDetail.documents.filter((x: LoanDocument) => x.is_co_applicant_document).map((x: LoanDocument) => x.name);
      // mandatory documents for co applicant based on his employement type
      const mandatoryCoApplicantDocs = this.getMandatoryDocumentsByType(this.loanDetail?.applicant_info?.employment_info.type);
      // check if buyer has uploaded mandatory documents
      mandatoryCoApplicantDocs.forEach((item: string) => {
        if (!coApplicantDocs.includes(item)) {
          isUploaded = false;
          return; // This will exit the forEach loop when any mandatory doc is not uploaded
        }
      });
    }
    return isUploaded;
  }

  getMandatoryDocumentsByType(employmentType: string): any {
    if (employmentType == EmployementType.EMPLOYED) {
      return this.mandatoryLoanDocuments['employed'];
    } else if (employmentType == EmployementType.SELF_EMPLOYED) {
      return this.mandatoryLoanDocuments['self_employed'];
    } else if (employmentType == EmployementType.RETIRED) {
      return this.mandatoryLoanDocuments['retired'];
    } else {
      return this.mandatoryLoanDocuments['employed'];
    }
  }

  updateLoanSummary(data: any) {
    this.loanDetail = data.loanDetail;
  }

  approveRejectLoan(isApprove: boolean){
    const modalRef = this.modalService.open(NotApproveDialogComponent, {
      windowClass: 'delete-document-modal',
      backdrop: 'static',
      keyboard: false
    })
    modalRef.componentInstance.loanId = this.loanDetail.id;
    modalRef.result.then((resApproved) => {
      if (resApproved) {
        const message = isApprove ? 'Loan has been approved successfully' : 'Loan has been rejected successfully';
        this.toastr.success(this.translate.instant(message));
        this.loanDetail.status = this.loanStatus.REJECTED;
      }
    }).catch((error: any) => {
    });
  }


  sendToLenderer(){
    this.loading = true;
    this.loanService.sendToLenderer({loan_id:this.loanDetail.id})
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.toastr.success(this.translate.instant('Loan details has been sent to Lenderer successfully!!'));
          this.modalRef = this.modalService.open(this.avalburoModal, { size: 'lg', backdrop: 'static', centered: true });
          setTimeout(() => {
            const element: any = document.getElementById("json");
            if(element){
              element.textContent = JSON.stringify(res.data, undefined, 2);
            }
          }, 500);
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


}
