
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Error } from 'src/app/shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { getFileType } from 'src/app/shared/helpers/file-helper';
import { ExpertReviewSteps, ExpertReviewStepsNumber, OrderStages, OrderStepsNumber } from 'src/app/shared/constant/add-order-constants';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { ExpertReviewService } from '../expert-review.service';
import { Order } from 'src/app/modules/buyers/buyer-orders/buyer-order.model';
import { UserService } from 'src/app/shared/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { CancelExpertReviewDetailsDialogComponent } from '../../expert-review-details/cancel-expert-review-details-dialog/cancel-expert-review-details-dialog.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})

export class PaymentComponent implements OnInit {
  @Input() currentStep: number;
  @Input() currentOrder: Order;
  @Input() currentExpertReview: any;
  @Input() currentExpertReviewStep:number;

  @Output() onSubmitOrderDetails: EventEmitter<{ orderDetail: Order, nextStep: number }> = new EventEmitter();
  @Output() onSubmitExpertReviewDetails:EventEmitter<{orderDetail?:Order, nextStep:number, expertReviewDetail: any}> = new EventEmitter();
  @ViewChild('openTermsForCashPayement') openTermsOfCash: TemplateRef<any>;

  isDocumentUploading: boolean;
  banckDetails: any;
  selectedPaymentMethod: string = 'card';
  isAccepted: boolean = false;
  loading: boolean = false;
  isCompulsory: boolean = false;
  modalRef: any;
  isPaymentMethodSelected: boolean = false;
  orderPrice: number = 0;
  completedStep: number = 0;
  isFormSubmitted:boolean = false;
  isReceiptUploading:boolean = false;
  isReceiptUploaded:boolean = false;
  receiptURL:any[] = [];
  receipts:any = [];
  isReceiptSubmited: boolean;
  expertPackagePrice: number;
  constructor(
    private modalService: NgbModal,
    private location: Location,
    private router: Router,
    private toastr: ToastrService,
    private fileUploadService:FileUploadService,
    private expertReviewService: ExpertReviewService,
    private userService: UserService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    
    this.expertPackagePrice = Number(this.currentExpertReview.package_details.package_price)
    if (this.currentExpertReview.payment?.status || this.currentExpertReview.bank_receipt?.is_bank_receipt) {
      const currentStep: any = this.currentExpertReview.current_step.toUpperCase();
      const completedStep: any = ExpertReviewStepsNumber[currentStep];
      this.completedStep = completedStep;
    }
  }

  selectPaymentMethod(e: any) {
    this.selectedPaymentMethod = e.target.value
  }

  confirm() {
    if (this.selectedPaymentMethod === 'bank') {
      this.modalRef = this.modalService.open(this.openTermsOfCash, { size: 'lg', backdrop: 'static', centered: true })
    } else if (this.selectedPaymentMethod === 'cash') {
      this.isPaymentMethodSelected = true;
      // this.modalRef = this.modalService.open(this.openTermsOfCash, { size: 'lg', backdrop: 'static', centered: true })
    } else if (this.selectedPaymentMethod === 'card') {
      this.sendUserForPaymentViaCard(this.selectedPaymentMethod);
    }
  }

  back() {
    this.location.back();
  }

  acceptTerms(e: any) {
    this.isAccepted = e.target.checked
    if (this.isAccepted === true) {
      this.isCompulsory = false;
    } else {
      this.isCompulsory = true;
    }
  }

  changePaymentMethod(){
    this.isPaymentMethodSelected = false;
    this.isAccepted = false;
    this.isCompulsory = false;
  }

  proceed() {
    this.modalRef.close();
    // this.getBankDetails('expert_review');
    this.isPaymentMethodSelected = true;
  }

  //this function is used to to-direct user to the stripe payment gateway for the card transaction
  private getBankDetails(paymentType: string): void {
    this.expertReviewService.getAccountDetails(paymentType, this.currentExpertReview.expert_review_id).subscribe({
      next: (res: any) => {
        this.banckDetails = res.data;
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

  //this function is used to to-direct user to the stripe payment gateway for the card transaction
  private sendUserForPaymentViaCard(paymentType: string): void {
    this.loading = true;
    this.expertReviewService.makePayment('expert_review', this.currentExpertReview.expert_review_id).subscribe({
      next: (res: any) => {
        this.loading = false;
        window.location.href = res.data.url;
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


  public async onDocumentChange(event: any) {
    let files = event.target.files;
    if (files) {
      let index = 0;
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 5120) {
          this.toastr.error(this.translate.instant('File size must be smaller than 5 MB'));
          this.isDocumentUploading = false;
          return;
        }
        const fileType = file.type;
        if (
          fileType != 'image/png' &&
          fileType != 'image/jpeg' &&
          fileType != 'application/pdf'
        ) {
          this.toastr.error(this.translate.instant('Allowed file type is only PDF, PNG and JPG'));
          return;
        }
        this.isDocumentUploading = true;
        await this.getPreSignedUrl(file).then((success) => {
          if (success) {
            if (index == files.length - 1) {
              this.isReceiptUploaded = true;
            }
          }
          index++;
        }).catch((error) => {
          return;
        });
      }
    }
  }


  setNextStep(): void {
    this.onSubmitExpertReviewDetails.emit({orderDetail:this.currentOrder, nextStep: ExpertReviewStepsNumber.SUMMARY, expertReviewDetail: this.currentExpertReview})
  }

  setPreviousStep(): void{
    if(this.currentOrder){
      this.onSubmitExpertReviewDetails.emit({orderDetail:this.currentOrder, nextStep: ExpertReviewStepsNumber.CONTACT_INFORMATION, expertReviewDetail: this.currentExpertReview})
    }else{
      this.onSubmitExpertReviewDetails.emit({orderDetail:this.currentOrder, nextStep: ExpertReviewStepsNumber.VEHICLE_INFORMATION, expertReviewDetail: this.currentExpertReview})
    }
  }

  getFileType(url: string) {
    return getFileType(url);
  }

  public get expertReviewStepNumber(): typeof ExpertReviewStepsNumber {
    return ExpertReviewStepsNumber;
  }
  public get expertReviewStep(): typeof ExpertReviewSteps {
    return ExpertReviewSteps;
  }
  //this functiojn is called when ROC Document, Legal Document or Prfile pucture change
  getPreSignedUrl(file: any) {
    this.isReceiptUploading = true;
    return new Promise((resolve, reject) => {
      let preSignedURL: any;
      preSignedURL = this.fileUploadService.getExpertBankReceiptPreSignedUrl({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size
      });
      preSignedURL.subscribe(
        async (res: any) => {
          if (res.data.url && res.data.key) {
            await this.fileUploadService.uploadFile(res.data.url, file).pipe().subscribe(() => {
              this.receiptURL = [];
              this.receiptURL .push({
                key: res.data.key,
                download_url: res.data.download_url
              });
              this.isReceiptUploading = false;
              resolve(true);
            }, () => {
              this.isReceiptUploading = false;
              this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
              reject(true);
            })
          }
        },
        (error: any) => {
          this.isReceiptUploading = false;
          if (error.error.error[0]) {
            this.toastr.error(error.error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }
      );
    });
  }

  //this function is used to update profile
  submitReceipt() {
    this.isFormSubmitted = true;
    if(!this.receiptURL.length) {
      return;
    }
    let userData = {
      "expert_review_id": this.currentExpertReview.expert_review_id,
      "asset_key": this.receiptURL[(this.receiptURL.length - 1)].key,
      "payment_method" : this.selectedPaymentMethod
    };
    if(!this.isReceiptSubmited){
      this.expertReviewService.submitBankReceipt(userData).pipe().subscribe({
        next: () => {
          this.isReceiptSubmited = true;
          const modalRef = this.modalService.open(SuccessfullComponent);
          modalRef.componentInstance.receiptUploaded = true;
          modalRef.componentInstance.expertReviewId = this.currentExpertReview.expert_review_id;
          if (this.currentOrder) {
            modalRef.componentInstance.order_id = this.currentOrder.order_id;
          }
          modalRef.result.then(() => {
          }).catch(() => {
          }); //don't remove catch() when user click in backdrop area then dismiss() will fire and error occured becaue we are using close() not dismiss()
        },
        error: (errorRes: Error) => {
          this.isReceiptSubmited = false;
          const error = errorRes.error;
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          }  else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }
      });
    }

  }

  //this function is used to dele Legal Document
  deleteLegalDocument(index: number) {
    this.receiptURL = [];
  }
  
  cancelExpertReview(expertReviewId: any) {
    const modalRef = this.modalService.open(CancelExpertReviewDetailsDialogComponent, {
      windowClass: 'cancel-order-modal',
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    })
    modalRef.componentInstance.expertReviewId = expertReviewId;
    modalRef.result.then((isCancel) => {
      if (isCancel) {
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'success-modal'
        })
        modalRef.componentInstance.cancelExpertReviewSuccess = true;
        // this.getOrderDetails()
      }
    }).catch((error: Error) => {
    });
  }
}
