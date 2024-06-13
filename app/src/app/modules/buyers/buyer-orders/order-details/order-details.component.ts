
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';

import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/shared/services/user.service';
import { BuyerOrdersService } from '../buyer-orders.service';

import { OrderStepsNumber, VehicleProcedureStepsNumber, VehicleReviewStatus } from 'src/app/shared/constant/add-order-constants';
import { Order } from '../buyer-order.model';
import { Error } from 'src/app/shared/models/error.model';

import { SuccessfullComponent } from '../../../../shared/modals/successfull/successfull.component';
import { CancelOrderDialogComponent } from './cancel-order-dialog/cancel-order-dialog.component';
import { ExpertReviewService } from 'src/app/shared/component/expert-review/expert-review.service';
import { CancelExpertReviewDetailsDialogComponent } from 'src/app/shared/component/expert-review-details/cancel-expert-review-details-dialog/cancel-expert-review-details-dialog.component';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class OrderDetailsComponent implements OnInit {
  @ViewChild('continueOrderBtn') continueOrderBtn: ElementRef;
  orderDetails: Order = new Order();
  orderId: string;
  currentStep: number = 1;
  sliderImages: Array<any> = [];
  loading: boolean = false;
  sellerType: Array<string> = [];
  procedureCurrentStepNo: number = 0;
  orderPrice: number;
  depositAmount: number;


  constructor(private buyerOrderService: BuyerOrdersService, private router: Router, private userService: UserService,
    private modalService: NgbModal, private activatedRoute: ActivatedRoute,
    private expertReviewService: ExpertReviewService, private translate: TranslateService,
    private toastr: ToastrService, private location: Location) { }

  ngOnInit(): void {
    localStorage.removeItem('current_order_id');
    localStorage.removeItem('current_expert_review_id');
    this.orderId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.loading = true;
    // this.activatedRoute.queryParams
    //   .subscribe((params: any) => {
    //     if (params && params.type && params.type == 'order') {
    //       localStorage.setItem('current_order_id', this.orderId);
    //       this.showPaymentModal(params.payment_success == 'true' ? true : false);
    //     }
    //   }
    //   );
    const paramType = this.activatedRoute.snapshot.queryParamMap.get('type') || null;
    const paymentSuccess = this.activatedRoute.snapshot.queryParamMap.get('payment_success') || null;
    if (paramType == 'order') {
      localStorage.setItem('current_order_id', this.orderId);
      this.showPaymentModal(paymentSuccess == 'true' ? true : false);
    }
    this.getOrderDetails();
  }

  getOrderDetails() {
    this.buyerOrderService.orderDetails(this.orderId).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.orderDetails = resp.data;
        this.sellerType = this.orderDetails.seller.type ? this.orderDetails.seller.type : ['user'];
        const orderStage: any = [this.orderDetails.current_stage.toUpperCase()]
        const currentStep: any = OrderStepsNumber[orderStage];
        this.currentStep = currentStep;

        if (this.orderDetails.vehicle.other_images?.length > 0) {
          this.sliderImages = this.orderDetails.vehicle.other_images.map((e: any) => e.url);
        }
        if (this.orderDetails.vehicle.primary_image) {
          this.sliderImages.unshift(this.orderDetails.vehicle.primary_image);
        }
        if (this.orderDetails.vehicle_procedure?.current_step) {
          const procedureCurrentStep: any = this.orderDetails.vehicle_procedure?.current_step.toUpperCase();
          const currentStepNumber: any = VehicleProcedureStepsNumber[procedureCurrentStep];
          this.procedureCurrentStepNo = currentStepNumber;
        }
        if(this.userService.isFromMobile){
          this.userService.isFromMobile = false;
          this.continueOrderBtn.nativeElement.scrollIntoView();
        }
        this.orderPrice = Number(this.orderDetails.original_price);
        if (this.orderDetails.negotiation_details.is_price_negotiating && this.orderDetails.negotiation_details.is_offer_accepted) {
          this.orderPrice = Number(this.orderDetails.negotiation_details.negotiated_price);
        }
        if(this.orderDetails.loan){
          this.depositAmount = this.orderPrice - this.orderDetails.loan.amount;
        }
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
          this.router.navigate(['/user/orders'])
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    })
  }

  public showPaymentModal(isPaymentSuccess: boolean) {
    if (isPaymentSuccess == true) {
      const modalRef = this.modalService.open(SuccessfullComponent, {
        windowClass: 'success-role-modal'
      })
      modalRef.componentInstance.paymentSuccess = true;
      modalRef.componentInstance.orderId = this.orderId;

    }else{
      this.toastr.error('Your payment is failed, please contact to admin');
      this.router.navigate(['/contact-us']);
    }
  }

  public get orderCurrentStepNumber(): typeof OrderStepsNumber {
    return OrderStepsNumber;
  }

  public get vehicleReviewStatus(): typeof VehicleReviewStatus {
    return VehicleReviewStatus;
  }

  back() {
    this.location.back()
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
        this.getOrderDetails()
      }
    }).catch((error: Error) => {
    });
  }

  continueOrder() {
    localStorage.setItem('current_order_id', this.orderId);
    this.buyerOrderService.setCurrentOrder(this.orderDetails)
    this.router.navigate([`/user/buyer-orders/add-order/${this.orderId}`])
  }

  cancelOrder() {
    const modalRef = this.modalService.open(CancelOrderDialogComponent, {
      windowClass: 'cancel-order-modal',
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    })
    modalRef.componentInstance.orderId = this.orderId;
    modalRef.result.then((isCancel) => {
      if (isCancel) {
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'success-modal'
        })
        modalRef.componentInstance.cancelOrderSuccess = true;
      }
    }).catch((error: Error) => {
    });
  }

  viewReport(appraisalReportId: any) {
    this.router.navigate([`/user/buyer-orders/appraisal-report/${appraisalReportId}`])
  }

  public get procedureStepNumber(): typeof VehicleProcedureStepsNumber {
    return VehicleProcedureStepsNumber;
  }
}
