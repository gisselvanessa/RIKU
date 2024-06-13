import { Location } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Order } from '../../buyer-order.model';
import { BuyerOrdersService } from '../../buyer-orders.service';
import { Error } from 'src/app/shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { getFileType } from 'src/app/shared/helpers/file-helper';
import { OrderStages, OrderStepsNumber } from 'src/app/shared/constant/add-order-constants';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { TranslateService } from '@ngx-translate/core';
import { VehicleProceduleDialogComponent } from '../vehicle-procedure/vehicle-procedule-dialog/vehicle-procedule-dialog.component';
import { LoanProcedureService } from 'src/app/modules/loan-procedure/loan-procedure.service';

@Component({
  selector: 'app-buy-now',
  templateUrl: './buy-now.component.html',
  styleUrls: ['./buy-now.component.scss']
})

export class BuyNowComponent implements OnInit, OnDestroy {

  @ViewChild('openTermsForCashPayement') openTermsOfCash: TemplateRef<any>;
  banckDetails:any = [ //datos quemados
    {
      bank_logo: '../../../../../assets/images/bank1.png',
      bank_name: "Banco Pichincha",
      type_account: "Corriente",
      account_number: "9500605400",
      account_name: "RIKU SA"
    },
    {
      bank_logo: '../../../../../assets/images/bank2.svg',
      bank_name: "Banco internacional",
      type_account: "Corriente",
      account_number: "48557510048",
      account_name: "RIKU SA"
    }
  ];

  constructor(
    private modalService: NgbModal,
    private location: Location,
    private router: Router,
    private toastr: ToastrService,
    private fileUploadService: FileUploadService,
    private buyerOrdersService: BuyerOrdersService,
    private translate:TranslateService,
    private loanProcedureService:LoanProcedureService
  ) { }

  selectedPaymentMethod: string = 'card';
  isAccepted: boolean = false;
  loading: boolean = false;
  isCompulsory: boolean;
  modalRef: any;
  isPaymentMethodSelected: boolean = false;
  @Input() currentStep: number;
  @Output() onSubmitDetails: EventEmitter<{ orderDetail: Order, nextStep: number }> = new EventEmitter();
  @Input() currentOrder: Order = new Order();
  orderPrice: number = 0;
  completedStep: number = 0;
  isFormSubmitted: boolean = false;
  isDocumentUploading: boolean = false;
  isDocumentUploaded: boolean = false;
  isReceiptUploaded: boolean = false;
  receiptURL: any[] = [];
  receipts: any = [];
  totalPayment: number = 0;
  secondsConter:string;
  timerInterval: any;
  depositAmount: number = 0;
  loanDetail: any;

  @HostListener('window:onload', ["$event"])
  goToPage (){
    this.router.navigate(['/user/buyer-orders/order-list']);
  }

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
      if(this.currentOrder.loan){
        if (this.currentOrder.loan.id != currentLoanId) {
          this.getLoanDetail(this.currentOrder.loan.id);
        } else {
          this.setLoanDetail(currentLoan);
        }
      }
    }

    this.orderPrice = Number(this.currentOrder.original_price);
    if (this.currentOrder.negotiation_details.is_price_negotiating && this.currentOrder.negotiation_details.is_offer_accepted) {
      this.orderPrice = Number(this.currentOrder.negotiation_details.negotiated_price);
    }
    if (this.currentOrder.loan) {
      // this.depositAmount = this.orderPrice - this.currentOrder.loan.amount;
      this.depositAmount = this.orderPrice * (this.currentOrder.loan.deposit_percentage/100);
    }
    if (this.currentOrder.payment?.status || this.currentOrder.bank_receipt.is_bank_receipt) {
      this.isPaymentMethodSelected = true;
      this.isReceiptUploaded = true;
      const currentStage: any = this.currentOrder.current_stage.toUpperCase();
      const completedStep: any = this.orderCurrentStepNumber[currentStage];
      this.completedStep = completedStep;
    }
    
    // if (this.currentOrder.vehicle_procedure.is_vehicle_procedure === null) {  
      
    if (this.currentOrder.vehicle_procedure.is_vehicle_procedure === null && !this.currentOrder.payment?.status && (this.currentOrder.loan === null || this.currentOrder.loan === undefined || this.currentOrder.loan === '')) {  // The cash payment modal appears when there is no loan
      this.showVehicleProcedureModal();
    }
    else{
      this.submitVehicleProcedureCheck(true); //set to Vehicle Procedure Check stage if loan exists
    }
    if (!this.isPaymentMethodSelected) {
      this.timer(1);
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
        // this.router.navigate(['/loan'])
      }
    });
  }

  setLoanDetail(currentLoan: any) {
    this.loanDetail = currentLoan;
  }

  timer(minute:number) {
    // let minute = 1;
    let seconds: number = minute * 180;
    let textSec: any = "0";
    let statSec: number = 60;
    const prefix = minute < 10 ? "0" : "";
    this.timerInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;
      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;
      this.secondsConter = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      if (seconds == 0) {
        clearInterval(this.timerInterval);
        this.router.navigate(['/user/buyer-orders/order-list'])
      }
    }, 1000);
  }

  resetPaymentMethod(){
    this.isPaymentMethodSelected = false;
    this.completedStep = OrderStepsNumber.VEHICLE_REVIEW;
    this.isReceiptUploaded = false;
    this.timer(1);
  }

  selectPaymentMethod(e: any) {
    this.selectedPaymentMethod = e.target.value
  }

  showVehicleProcedureModal() {
    const modalRef = this.modalService.open(VehicleProceduleDialogComponent, {
      windowClass: 'vehicle-procedure-modal',
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    })
    modalRef.result.then((isProcedureAgrred) => {
      if (isProcedureAgrred) {
        this.submitVehicleProcedureCheck(true);
      } else {
        //this.submitVehicleProcedureCheck(false);
        this.cancelOrderOnRejectProcedure();
      }
    }).catch((error: any) => {
      if (error == true && error == 0) {
        //this.submitVehicleProcedureCheck(false);
        this.cancelOrderOnRejectProcedure();
      }
    });
  }

  cancelOrderOnRejectProcedure(){
    this.buyerOrdersService.cancelOrder({ order_id: this.currentOrder.order_id }).subscribe({
      next: () => {
        this.loading = false;
       this.toastr.info(this.translate.instant('Your order has been canceled as you have declined vehicle processing service.'));
       this.router.navigate([`/buyer/orders`])
      },
      error: (errorRes: Error) => {
      }
    });
  }

  submitVehicleProcedureCheck(isVehicleProcedureCheck: boolean = false) {
    this.loading = true;
    this.buyerOrdersService.setVehicleProcedureCheck(this.currentOrder.order_id,
      isVehicleProcedureCheck, OrderStages.VEHICLE_PROCEDURE_CHECK).subscribe({
        next: () => {
          this.loading = false;
          const vehicle_procedure: any = {
            order_id: this.currentOrder.order_id,
            is_vehicle_procedure: isVehicleProcedureCheck
          };
          this.currentOrder.vehicle_procedure = vehicle_procedure;
          if(this.timerInterval){
            clearInterval(this.timerInterval);
          }
          this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.BUY_NOW });
        },
        error: (errorRes: Error) => {
          const error = errorRes.error;
          this.loading = false;
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error('Something Went Wrong Please Try again later');
          }
        }
      });
  }

  confirm() {
    if(this.timerInterval){
      clearInterval(this.timerInterval);
    }
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
    this.location.back()
  }

  acceptTerms(e: any) {
    this.isAccepted = e.target.checked
    if (this.isAccepted === true) {
      this.isCompulsory = false;
    } else {
      this.isCompulsory = true;
    }
  }


  proceed() {
    this.modalRef.close();
    // this.getBankDetails('order');
    this.isPaymentMethodSelected = true;
  }

  //this function is used to to-direct user to the stripe payment gateway for the card transaction
  private getBankDetails(paymentType: string): void {
    this.buyerOrdersService.getAccountDetails(paymentType, this.currentOrder.order_id).subscribe({
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
    this.buyerOrdersService.makePayment('order', this.currentOrder.order_id).subscribe({
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
              this.isDocumentUploaded = true;
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

    let nextStep = OrderStepsNumber.VEHICLE_DELIVERY_STATUS;
    if(this.currentOrder.loan?.id){
      nextStep = OrderStepsNumber.LOAN;
    } else{
      nextStep = OrderStepsNumber.VEHICLE_PROCEDURE;
    }
    // else if(this.currentOrder.vehicle_procedure?.is_vehicle_procedure){
    //   nextStep = OrderStepsNumber.VEHICLE_PROCEDURE;
    // }
    if(this.timerInterval){
      clearInterval(this.timerInterval);
    }
    this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: nextStep });
  }
  managePreviousStep(){
    const disableButton = this.currentOrder.vehicle.is_price_negotiable ? false: this.currentOrder.meetings.length === 0
    if(disableButton){
      this.backOrderList();
    }
    else{
      this.setPreviousStep();
    }
  }
  backOrderList(){
    this.router.navigate([`/user/buyer-orders/order-list`])
    
  }
  setPreviousStep(): void {
    if(this.timerInterval){
      clearInterval(this.timerInterval);
    }
    if (this.currentOrder.negotiation_details.is_price_negotiating) {
      this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: this.orderCurrentStepNumber.PRICE_NEGOTIATION });
    } else {
      this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: this.orderCurrentStepNumber.VEHICLE_REVIEW });
    }
  }

  getFileType(url: string) {
    return getFileType(url);
  }

  public get orderCurrentStepNumber(): typeof OrderStepsNumber {
    return OrderStepsNumber;
  }

  //this functiojn is called when ROC Document, Legal Document or Prfile pucture change
  getPreSignedUrl(file: any) {
    this.isDocumentUploading = true;
    return new Promise((resolve, reject) => {
      let preSignedURL: any;
      preSignedURL = this.fileUploadService.getBankRecepitPreSignedUrl({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size
      });
      preSignedURL.subscribe(
        async (res: any) => {
          if (res.data.url && res.data.key) {
            await this.fileUploadService.uploadFile(res.data.url, file).pipe().subscribe(() => {
              this.receiptURL.push({
                key: res.data.key,
                download_url: res.data.download_url
              });
              this.isDocumentUploading = false;
              resolve(true);
            }, () => {
              this.isDocumentUploading = false;
              this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
              reject(true);
            })
          }
        },
        (error: any) => {
          this.isDocumentUploading = false;
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
    if (!this.receiptURL.length) {
      return;
    }
    let userData = {
      "order_id": this.currentOrder.order_id,
      "asset_key": this.receiptURL[0].key,
      "payment_method": this.selectedPaymentMethod
    };
    this.buyerOrdersService.submitBankReceipt(userData).pipe().subscribe({
      next: () => {
        const modalRef = this.modalService.open(SuccessfullComponent);
        modalRef.componentInstance.receiptUploaded = true;
        modalRef.componentInstance.order_id = this.currentOrder.order_id;
        modalRef.result.then(() => {
          this.showPriceNegotiationStep();
        }).catch(() => {
          this.showPriceNegotiationStep();
        }); //don't remove catch() when user click in backdrop area then dismiss() will fire and error occured becaue we are using close() not dismiss()
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


  //this function is used to dele Legal Document
  deleteLegalDocument(index: number) {
    this.receiptURL = [];
  }

  showPriceNegotiationStep() {
    this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: this.orderCurrentStepNumber.VEHICLE_DELIVERY_STATUS });
  }

  ngOnDestroy(){
    if(this.timerInterval){
      clearInterval(this.timerInterval);
    }
  }

}
