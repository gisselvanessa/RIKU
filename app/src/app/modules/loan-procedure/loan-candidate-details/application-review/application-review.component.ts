import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { BuyerOrdersService } from 'src/app/modules/buyers/buyer-orders/buyer-orders.service';
import { LoanStages, LoanStepsNumber, EmployementType, LoanStatus, MandatoryLoanDocuments } from 'src/app/shared/constant/loan-constants';
import { LoanProcedureService } from '../../loan-procedure.service';
import { OrderStages } from 'src/app/shared/constant/add-order-constants';
import { ApplicationReviewAccordianName } from '../accordian.model';
import { Error } from 'src/app/shared/models/error.model';
import { LoanDocument } from '../../load-procedure.model';
import { ComingSoonComponent } from 'src/app/shared/modals/coming-soon/coming-soon.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getFormatedDate } from '../../../../shared/helpers/date-helper';
import { VehicleDetailsService } from 'src/app/modules/buyers/buyer-vehicle/buyer-vehicle-details/vehicle-details.service';
import { VehicleDetail } from 'src/app/shared/models/vehicle.model';

@Component({
  selector: 'app-application-review',
  templateUrl: './application-review.component.html',
  styleUrls: ['./application-review.component.scss']
})

export class ApplicationReviewComponent implements OnInit, OnChanges {

  constructor(private toastr: ToastrService, private modalService: NgbModal, private translate: TranslateService, private loanProcedureService: LoanProcedureService,
    private buyerOrdersService: BuyerOrdersService, private router: Router,
    private vehicleDetailsService: VehicleDetailsService,
    ) { }

  accordianOpen: Array<any> = [false, false, false];
  accordianName = ApplicationReviewAccordianName;
  @ViewChild('approved') apporvedModal: TemplateRef<any>;
  @ViewChild('pending') pendingModal: TemplateRef<any>;
  @ViewChild('cancelled') cancelledModal: TemplateRef<any>;
  @ViewChild('rejected') rejectedModal: TemplateRef<any>;
  @ViewChild('qualified') qualifiedModal: TemplateRef<any>;
  @ViewChild('completed') completedModal: TemplateRef<any>;
  @ViewChild('documentUpload') documentUploadModal: TemplateRef<any>;
  @ViewChild('documentUploadAkv') documentUploadAkvModal: TemplateRef<any>;
  @ViewChild('eleApplicantDoc') eleApplicantDoc: ElementRef<any>

  selectedAccordian: string;
  applicantDocuments: any = {};
  coApplicantDocuments: any = {};
  @Input() isFromSummary: boolean = false;
  @Input() currentStep: number;
  @Input() currentLoanDetail: any
  @Output() onSubmitApplicantDetails: EventEmitter<{ loanDetail: any, nextStep: number }> = new EventEmitter();
  @Input() loanDetail: any;
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
  isNegotiable: boolean = false;
  totalToBeFinancedValue: any;
  loanAmount:any;
  modalRef: any;
  vehicleDetail: VehicleDetail = new VehicleDetail();

  ngOnInit(): void {
    if (this.currentLoanDetail) {
      this.vehicleInfo = this.currentLoanDetail.vehicle
      this.applicantInfo = this.currentLoanDetail.applicant_info

      if (this.applicantInfo.is_co_applicant) {
        this.coApplicantInfo = this.currentLoanDetail.co_applicant_info
      }
      if (this.currentLoanDetail.reference_info) {
        this.referenceInfo = this.currentLoanDetail.reference_info
      }
      if (this.vehicleInfo.other_img_urls?.length > 0) {
        this.sliderImages = this.vehicleInfo.other_img_urls.map((e: any) => e);
      }
      if (this.vehicleInfo.cover_img_url) {
        this.sliderImages.unshift(this.vehicleInfo.cover_img_url);
      }
    }
    this.getVehicleDetails();
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.currentLoanDetail) {
      this.vehicleInfo = this.currentLoanDetail.vehicle
      this.applicantInfo = this.currentLoanDetail.applicant_info
      if (this.applicantInfo.is_co_applicant) {
        this.coApplicantInfo = this.currentLoanDetail.co_applicant_info
      }
      this.referenceInfo = this.currentLoanDetail.reference_info
      this.totalToBeFinancedValue = Number(this.currentLoanDetail.amount) + Number(this.currentLoanDetail?.charges?.vehicle_insurance_and_tracking) + Number(this.currentLoanDetail?.charges?.administrative_charges) + Number(this.currentLoanDetail?.charges?.financing_equity)
      this.loanAmount = Number(this.currentLoanDetail.amount)
      // if (this.vehicleInfo.other_img_urls?.length > 0) {
      //   this.sliderImages = this.vehicleInfo.other_img_urls.map((e: any) => e);
      // }
      // if (this.vehicleInfo.cover_img_url) {
      //   this.sliderImages.unshift(this.vehicleInfo.cover_img_url);
      // }
      this.loanDetail = this.currentLoanDetail;
      this.currentLoanDetail.documents.forEach((document: any) => {
        if (document.is_co_applicant_document) {
          this.coApplicantDocuments[document.name] = document;
        } else {
          this.applicantDocuments[document.name] = document;
        }
      });
    }
  }
  getVehicleDetails(){
    this.loading = true;
    this.vehicleDetailsService
    .getVehicleDetails(this.vehicleInfo.id)
    .pipe()
    .subscribe(
      (response: any) => {
        this.loading = false;
        this.vehicleDetail = response.data;
        this.isNegotiable = this.vehicleDetail.is_negotiable;
        console.log(this.vehicleDetail);
        
      },
      ({ error, status }) => {
        this.loading = false;
        if (error.error[0]) {
          this.toastr.error(error.error[0]);
          // this.location.back();
        } else {
          const message = this.translate.instant('Something Went Wrong Please Try again later')
          this.toastr.error(message);
        }
      }
    );
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

  setPreviousStep() {
    this.onSubmitApplicantDetails.emit({ loanDetail: this.currentLoanDetail, nextStep: LoanStepsNumber.REFERENCE_INFO });
  }

  agreeTerms(event: any) {
    this.acceptTermsAndCondition = event.target.checked
  }

  public get loanCurrentStage(): typeof LoanStages {
    return LoanStages;
  }

  submit() {
    if (!this.acceptTermsAndCondition) {
      this.toastr.error(this.translate.instant("Please accept terms and condition to move further"))
    } else {
      let sendData: any = {
        current_stage: this.loanCurrentStage.APPLICATION_REVIEW,
        id: this.currentLoanId,
        is_tnc_accepted: this.acceptTermsAndCondition
      }
      this.loanProcedureService.patchLoanDetails(sendData).subscribe({
        next: (resp: any) => {
          if (resp.data.status == 'approved') {
            this.currentLoanDetail.status = resp.data.status
            this.modalRef = this.modalService.open(this.apporvedModal, { size: 'md', backdrop: 'static', centered: true });
          } else if (resp.data.status == 'pending') {
            this.currentLoanDetail.status = resp.data.status
            this.modalRef = this.modalService.open(this.pendingModal, { size: 'md', backdrop: 'static', centered: true });
          } else if (resp.data.status == 'qualified') {
            this.currentLoanDetail.status = resp.data.status
            this.modalRef = this.modalService.open(this.qualifiedModal, { size: 'md', backdrop: 'static', centered: true });
          } else if (resp.data.status == 'rejected') {
            this.currentLoanDetail.status = resp.data.status
            this.modalRef = this.modalService.open(this.rejectedModal, { size: 'md', backdrop: 'static', centered: true });
          } else if (resp.data.status == 'cancelled') {
            this.currentLoanDetail.status = resp.data.status
            this.modalRef = this.modalService.open(this.cancelledModal, { size: 'md', backdrop: 'static', centered: true });
          } else if (resp.data.status == 'completed') {
            this.currentLoanDetail.status = resp.data.status
            this.modalRef = this.modalService.open(this.completedModal, { size: 'md', backdrop: 'static', centered: true });
          }
          this.onSubmitApplicantDetails.emit({ loanDetail: this.currentLoanDetail, nextStep: LoanStepsNumber.SUMMARY });
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

  purchaseWithLoan() {
    if (!this.isAllRequiredDocumentUploaded()) {
      this.modalRef = this.modalService.open(this.documentUploadModal, { size: 'md', backdrop: 'static', centered: true });
      this.modalRef.result.then((continuePurchase) => {
        if (continuePurchase) {
          this.processPurchase();
        }
      })
    }else{
      this.processPurchase();
    }
  }

  purchaseWithLoanNegotiation() {
    if (!this.isAllRequiredDocumentUploaded()) {
      this.modalRef = this.modalService.open(this.documentUploadAkvModal, { size: 'md', backdrop: 'static', centered: true });
      this.modalRef.result.then((continuePurchase) => {
        if (continuePurchase) {
          if(this.isNegotiable==true){
            this.processPurchaseNegotiation();
          }
          else{
            this.processPurchaseNegotiationReject();
          }
        }
      })
    }else{
      if(this.isNegotiable==true){
        this.processPurchaseNegotiation();
      }
      else{
        this.processPurchaseNegotiationReject();
      }
    }
  }

  goToOrder() {
    if (!this.isAllRequiredDocumentUploaded()) {
      this.modalRef = this.modalService.open(this.documentUploadAkvModal, { size: 'md', backdrop: 'static', centered: true });
      this.modalRef.result.then((continuePurchase) => {
        if (continuePurchase) {
          this.processPurchase();
        }
      })
    }else{
      this.processPurchase();
    }
  }

  processPurchase(){
    this.loading = true;
    this.buyerOrdersService.postOrder({ vehicle_id: this.loanDetail.vehicle.id, loan_id: this.loanDetail.id, current_stage: OrderStages.PLACED })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
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

  async processPurchaseNegotiation() {
    this.loading = true;
    this.buyerOrdersService.postOrder({ vehicle_id: this.loanDetail.vehicle.id, loan_id: this.loanDetail.id, current_stage: OrderStages.PRICE_NEGOTIATION })
      .subscribe({
        next: async (res: any) => {
          this.loading = false;
          localStorage.setItem('current_order_id', res.data.order_id);
          this.router.navigate([`/user/buyer-orders/add-order/${res.data.order_id}`]);
          this.currentLoanDetail.order_id = res.data.order_id;
          // if(this.isNegotiable === false){
          //   await this.rejectVehiclePriceNegociation();
          // }
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

  async processPurchaseNegotiationReject() {
    this.loading = true;
    this.buyerOrdersService.postOrder({ vehicle_id: this.loanDetail.vehicle.id, loan_id: this.loanDetail.id, current_stage: OrderStages.VEHICLE_PROCEDURE_CHECK })
      .subscribe({
        next: async (res: any) => {
          this.loading = false;
          localStorage.setItem('current_order_id', res.data.order_id);
          this.router.navigate([`/user/buyer-orders/add-order/${res.data.order_id}`]);
          this.currentLoanDetail.order_id = res.data.order_id;
          await this.rejectVehiclePriceNegociation();
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
  public get orderCurrentStage(): typeof OrderStages {
    return OrderStages;
  }
  async rejectVehiclePriceNegociation(){
    this.loading = true;
    this.buyerOrdersService.negotiatePrice({
      order_id: this.currentLoanDetail.order_id,
      offered_price: this.currentLoanDetail.vehicle.price,
      is_price_negotiating: false
    }).subscribe({
      next: () => {
        this.loading = false;
        const negotiation_details: any = {
          order_id: this.currentLoanDetail.order_id,
          negotiated_price: Number(this.currentLoanDetail.vehicle.price),
          is_price_negotiating: false,
          is_offer_accepted: null
        };
        this.currentLoanDetail.current_stage = this.orderCurrentStage.PRICE_NEGOTIATION;
        this.currentLoanDetail.negotiation_details = negotiation_details;
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


  comingSoon() {
    const modalRef = this.modalService.open(ComingSoonComponent, {
      windowClass: 'delete-vehicle-modal'
    })
  }

  getFormatedDate(dateString: string) {
    return getFormatedDate(dateString);
  }


  scrollToUploadDocuments(){
    if (this.selectedAccordian != this.accordianName.APPLICANT_DOCUMENTS) {
      this.selectAccordian(this.accordianName.APPLICANT_DOCUMENTS, 3)
    }
    let scrollTimeOut = setTimeout(() => {
        this.eleApplicantDoc.nativeElement.scrollIntoView();
        clearTimeout(scrollTimeOut);
    }, 500);
  }

  continueOrderProcess(orderId: string){
    localStorage.setItem('current_order_id', orderId);
    this.router.navigate([`/user/buyer-orders/add-order/${orderId}`])
  }
}
