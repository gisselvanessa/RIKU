import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderStepsNumber, VehicleProcedureStepsNumber, VehicleReviewStatus } from 'src/app/shared/constant/add-order-constants';
import { Error } from 'src/app/shared/models/error.model';
import { OrderDetails } from '../dealer-order.model';
import { DealerOrdersService } from '../dealer-orders.service';
import { TranslateService } from '@ngx-translate/core';
import { CancelOrderDialogComponent } from 'src/app/modules/buyers/buyer-orders/order-details/cancel-order-dialog/cancel-order-dialog.component';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerOrdersService } from 'src/app/modules/sellers/seller-orders/seller-orders.service';

@Component({
  selector: 'app-dealer-order-details',
  templateUrl: './dealer-order-details.component.html',
  styleUrls: ['./dealer-order-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DealerOrderDetailsComponent implements OnInit {

  orderDetails: OrderDetails;
  loading: boolean = false;
  orderId: string;
  currentStep: number = 1;
  sliderImages: Array<any> = [];
  selectedStatus: string;
  selectedStatusId: string;
  procedureCurrentStepNo: number = 0;
  meetingStatusList: Array<string> = ['Accept','Reschedule'];

  statusList = [{ id: 'delivery_due', status: 'Delivery Due' },
  { id: 'out_for_delivery', status: 'Out for Delivery' },
  { id: 'delivered', status: 'Delivered' }];
  isPriceAcceptLoader = {loader:false, type:null};
  orderPrice: number;
  depositAmount: number;
  constructor(
    private sellerOrderService: SellerOrdersService, private dealerOrdersService: DealerOrdersService, private router: Router,private modalService: NgbModal,
    private activateroute: ActivatedRoute, private location:Location,
    private toastr:ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {
    localStorage.removeItem('current_order_id');
    this.orderId = this.activateroute.snapshot.paramMap.get('id') || '';
    this.dealerOrdersService.orderDetails(this.orderId).subscribe({next:(resp: any) => {
      this.orderDetails = resp.data;
      console.log(this.orderDetails);
      
      if(this.orderDetails.delivery_status){
        for(let i = 0;i<this.statusList.length;i++){
          if(this.orderDetails.delivery_status == this.statusList[i].id){
            this.selectedStatus = this.statusList[i].status
          }
        }
      }
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
      this.orderPrice = Number(this.orderDetails.original_price);
      if (this.orderDetails.negotiation_details.is_price_negotiating && this.orderDetails.negotiation_details.is_offer_accepted) {
        this.orderPrice = Number(this.orderDetails.negotiation_details.negotiated_price);
      }
      if (this.orderDetails.loan) {
        this.depositAmount = this.orderPrice - this.orderDetails.loan.amount;
      }
    },
    error:(errorRes:Error)=>{
      const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
          this.router.navigate(['/dealer/orders'])
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
    }
  })
  }

  // continueOrder() {
  //   localStorage.setItem('current_order_id', this.orderId);
  //   this.dealerOrdersService.setCurrentOrder(this.orderDetails)
  //   this.router.navigate(['/dealer/orders'])
  // }

  public get orderCurrentStepNumber(): typeof OrderStepsNumber {
    return OrderStepsNumber;
  }

  public get vehicleReviewStatus(): typeof VehicleReviewStatus {
    return VehicleReviewStatus;
  }
  updateMeetingStatus(status:string, meeting:any) {
    const meetingStatus = status == 'Accept'? true:false
    this.loading = true;
    this.sellerOrderService.confirmMeeting({
      meeting_id: meeting.uuid,
      status: meetingStatus
    }).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.ngOnInit();
        
        setTimeout(() => {
          this.toastr.success(this.translate.instant('Meeting Status Updated Successfully'));
        },300);
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
  getMeetingStatusText(isAccepted: boolean | null): string {
    if (isAccepted === null) {
      return 'Pending';
    } else if (isAccepted === false) {
      return 'Reschedule';
    } else {
      return 'Accept';
    }
  }
  back() {
    this.location.back()
  }

  selectValue(event: any, name: any) {
    if (event.target.checked) {
      this.selectedStatusId = event.target.value
      this.selectedStatus = name
    }

  }

  applyStatus(){
    this.dealerOrdersService.sendDeliveryStatus(this.selectedStatusId, this.orderId).subscribe({next:(resp: any) => {
      if (resp.success_code === 'VEHICLE_DELIVERY_STATUS_UPDATED') {
        this.dealerOrdersService.orderDetails(this.orderId).subscribe((resp1: any) => {
          this.orderDetails = resp1.data;
          this.orderPrice = Number(this.orderDetails.original_price);
          if (this.orderDetails.negotiation_details.is_price_negotiating && this.orderDetails.negotiation_details.is_offer_accepted) {
            this.orderPrice = Number(this.orderDetails.negotiation_details.negotiated_price);
          }
          if (this.orderDetails.loan) {
            this.depositAmount = this.orderPrice - this.orderDetails.loan.amount;
          }
        })
      }
    },
    error:(errorRes: Error)=>{
      const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
    }
  })
  }
  public get procedureStepNumber(): typeof VehicleProcedureStepsNumber {
    return VehicleProcedureStepsNumber;
  }

  sendOfferResponse(offerResponse:any,orderId:any){
    this.isPriceAcceptLoader.type = offerResponse;
    this.isPriceAcceptLoader.loader = false;
    this.dealerOrdersService.sendOfferResponse(offerResponse,orderId).subscribe({next:(resp:any)=>{
      this.isPriceAcceptLoader.type = null;
      this.isPriceAcceptLoader.loader = false;
      if (resp.success_code === 'SUCCESSFULLY_PRICE_NEGOTIATIONS_DETAILS') {
        this.dealerOrdersService.orderDetails(this.orderId).subscribe((resp1: any) => {
          this.orderDetails = resp1.data;
        })
      }
    },
    error:(errorRes: Error)=>{
      this.isPriceAcceptLoader.type = null;
      this.isPriceAcceptLoader.loader = false;
      const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
    }
  })
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
}
