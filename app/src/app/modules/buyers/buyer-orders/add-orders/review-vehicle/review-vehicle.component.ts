import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from '@angular/router';
import { OrderStages, VehicleReviewStatus } from 'src/app/shared/constant/add-order-constants';
import { Order } from '../../buyer-order.model';
import { BuyerOrdersService } from '../../buyer-orders.service';
import { Error } from 'src/app/shared/models/error.model';
import { PriceNegotiationDialogComponent } from '../price-negotiation/price-negotiation-dialog/price-negotiation-dialog.component';
import { VehicleProceduleDialogComponent } from '../vehicle-procedure/vehicle-procedule-dialog/vehicle-procedule-dialog.component';
import { OrderStepsNumber } from '../../../../../shared/constant/add-order-constants';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-review-vehicle',
  templateUrl: './review-vehicle.component.html',
  styleUrls: ['./review-vehicle.component.scss']
})

export class ReviewVehicleComponent implements OnInit {
  @Input() currentStep: number;
  @Output() onSubmitDetails: EventEmitter<{orderDetail: Order, nextStep: number}> = new EventEmitter();
  @Input() currentOrder: Order;


  reviewStatus: string = VehicleReviewStatus.AS_EXPECTED;
  noPurchaseReason: string = '';
  loading: boolean = false;

  constructor(private toastr: ToastrService, private modalService: NgbModal,
    private buyerOrdersService: BuyerOrdersService, private router: Router,
    private translate: TranslateService) { }

  ngOnInit(): void {
  }

  onSubmit(): void{
    if(this.reviewStatus == VehicleReviewStatus.NOT_AS_EXPECTED && (this.noPurchaseReason.trim() == '' || !this.noPurchaseReason)){
      this.toastr.warning(this.translate.instant('Please provide reason!!'));
      return;
    }
    const reviewVehicleData: any = {
      order_id: this.currentOrder.order_id,
      current_stage: this.orderCurrentStage.VEHICLE_REVIEW,
      vehicle_review_status: this.reviewStatus
    }
    if(this.noPurchaseReason){
      reviewVehicleData['vehicle_review_comment'] = this.noPurchaseReason.trim();
    }
    this.loading = true;
    this.buyerOrdersService.reviewVehicle(reviewVehicleData).subscribe({
      next: () => {
        this.loading = false;
        this.currentOrder.vehicle_review = reviewVehicleData;
        
        if(this.currentOrder.vehicle.is_price_negotiable == true){
          this.currentOrder.current_stage = this.orderCurrentStage.PRICE_NEGOTIATION;
        }
        else{
          this.currentOrder.current_stage = this.orderCurrentStage.BUY_NOW;
        }
        if(this.reviewStatus == VehicleReviewStatus.NOT_AS_EXPECTED){
          this.router.navigate(['/buyer/orders']);
        }else{
          // this.showPriceNegotiationModal();
          this.showPriceNegotiationStep();
        }
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

  showPriceNegotiationModal(){
    if(this.currentOrder.vehicle.is_price_negotiable){
      const modalRef = this.modalService.open(PriceNegotiationDialogComponent, {
        windowClass: 'price-negotiation-modal',
        backdrop : 'static',
        keyboard : false,
        size: 'md'
      })
      modalRef.result.then((isPriceNegotiate) => {
        if (isPriceNegotiate) {
          this.showPriceNegotiationStep();
        }else{
          this.noNegotiate();
        }
      }).catch((error: any) => {
        if (error == true && error == 0) {
         this.noNegotiate();
        }
      });
    }else{
      this.noNegotiate();
    }
  }

  noNegotiate(){
    this.buyerOrdersService.negotiatePrice({order_id: this.currentOrder.order_id,
      offered_price: 0, is_price_negotiating: false}).subscribe({
        next: () => {
          this.loading = false;
          const offeredPrice = 0;
          const negotiation_details: any = {
            order_id: this.currentOrder.order_id,
            negotiated_price: Number(offeredPrice),
            is_price_negotiating: false,
            is_offer_accepted: false
          };
          this.currentOrder.current_stage = this.orderCurrentStage.PRICE_NEGOTIATION;
          this.currentOrder.negotiation_details = negotiation_details;
          this.showVehicleProcedureModal();
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

  showVehicleProcedureModal(){
    const modalRef = this.modalService.open(VehicleProceduleDialogComponent, {
      windowClass: 'vehicle-procedure-modal',
      backdrop : 'static',
      keyboard : false,
      size: 'lg'
    })
    modalRef.result.then((isProcedureAgrred) => {
      if(isProcedureAgrred){
        this.submitVehicleProcedureCheck(true);
      }else{
        //this.submitVehicleProcedureCheck(false);
        this.cancelOrderOnRejectProcedure();
      }
    }).catch((error: any) => {
      if (error == true && error == 0) {
        // this.submitVehicleProcedureCheck(false);
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

  submitVehicleProcedureCheck(isVehicleProcedureCheck: boolean = false){
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
          this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.BUY_NOW });
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

  setNextStep(): void {
    if(this.currentOrder.current_stage == OrderStages.VEHICLE_REVIEW || this.currentOrder.negotiation_details.is_price_negotiating === null){
      // this.showPriceNegotiationModal();
      debugger;
      this.showPriceNegotiationStep();
    }else{
      if(this.currentOrder.negotiation_details.is_price_negotiating === true){
        this.showPriceNegotiationStep();
      }else{
        this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.BUY_NOW });
      }
    }
  }

  showPriceNegotiationStep(){
    if(this.currentOrder.vehicle.is_price_negotiable == true){
      this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.PRICE_NEGOTIATION });
    }
    else{
      this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.BUY_NOW });
    }
  }

  setPreviousStep(){
    //this.currentOrder.current_stage = this.orderCurrentStage.VEHICLE_REVIEW;
    if(this.currentOrder.expert_evaluation.is_expert_evaluation){
      this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.EXPERT_EVALUATION });
    }else{
      this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.SCHEDULE_MEETING });
    }
  }

  public get orderCurrentStage(): typeof OrderStages {
    return OrderStages;
  }

  public get vehicleReviewStatus(): typeof VehicleReviewStatus {
    return VehicleReviewStatus;
  }
}
