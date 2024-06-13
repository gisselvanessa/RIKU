import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { OrderStepsNumber } from 'src/app/shared/constant/add-order-constants';
import { Error } from 'src/app/shared/models/error.model';
import { Order } from '../buyer-order.model';
import { BuyerOrdersService } from '../buyer-orders.service';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-add-orders',
  templateUrl: './add-orders.component.html',
  styleUrls: ['./add-orders.component.scss']
})

export class AddOrdersComponent implements OnInit, OnDestroy {

  constructor(private location: Location, private buyerOrdersService: BuyerOrdersService,
    private toastr: ToastrService, private router: Router, private translate: TranslateService,
    private userService:UserService, private activatedRoute: ActivatedRoute
    ) { }

  currentStep: number;
  orderDetail: Order = new Order();
  loading: boolean = false;
  @ViewChild('orderStepsWrapper') orderStepsWrapper: ElementRef;

  ngOnInit(): void {
    let currentOrderId = this.activatedRoute.snapshot.paramMap.get('id') || null;
    if (!currentOrderId) {
      currentOrderId = localStorage.getItem('current_order_id');
    }
    let currentOrder: any = this.buyerOrdersService.getCurrentOrder();
    if (currentOrderId) {
      if (currentOrder) {
        if (currentOrder.order_id != currentOrderId) {
          this.getOrderDetail(currentOrderId);
        } else {
          this.setOrderDetail(currentOrder);
        }
      } else {
        this.getOrderDetail(currentOrderId);
      }
    } else {
      this.router.navigate(['/buyer/orders'])
    }
  }

  getOrderDetail(orderId: string) {
    this.loading = true;
    this.buyerOrdersService.orderDetails(orderId).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.setOrderDetail(res.data);
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
  rejectVehiclePriceNegociation(){
    this.loading = true;
    this.buyerOrdersService.negotiatePrice({
      order_id: this.orderDetail.order_id,
      offered_price: this.orderDetail.original_price,
      is_price_negotiating: false
    }).subscribe({
      next: () => {
        this.loading = false;
        const negotiation_details: any = {
          order_id: this.orderDetail.order_id,
          negotiated_price: Number(this.orderDetail.original_price),
          is_price_negotiating: false,
          is_offer_accepted: null
        };
        // this.currentOrder.current_stage = this.orderCurrentStage.PRICE_NEGOTIATION;
        this.orderDetail.negotiation_details = negotiation_details;
        // this.isPriceNegotiated = false;
        // this.setNextStep(this.currentStep + 1)
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
  setOrderDetail(currentOrder: Order) {
    this.orderDetail = currentOrder;
    if (this.orderDetail.current_stage) {
      this.orderDetail.current_stage = this.orderDetail.current_stage == 'loan_documents' ? 'loan' : this.orderDetail.current_stage;
      const orderStage: any = this.orderDetail.current_stage.toUpperCase();
      let currentStep: any = OrderStepsNumber[orderStage];
      if (currentStep == OrderStepsNumber.BUY_NOW && this.orderDetail.negotiation_details.is_price_negotiating === null) {
        currentStep = OrderStepsNumber.PRICE_NEGOTIATION;
      }
      this.currentStep = currentStep;
      if (this.currentStep == OrderStepsNumber.VEHICLE_PROCEDURE_CHECK) {
        this.currentStep = OrderStepsNumber.BUY_NOW;
      }
      if(this.orderDetail.vehicle.is_price_negotiable == false){
        this.rejectVehiclePriceNegociation()
      }
    }

  }

  setNextStep(data: any) {
    this.currentStep = data.nextStep;
    this.orderDetail = data.orderDetail;
    localStorage.setItem('current_order_id',this.orderDetail.order_id);
    //In case no routing is there then use it
    this.userService.updateNotificationList(true);
    this.orderStepsWrapper.nativeElement.scrollIntoView();
  }

  ngOnDestroy() {
    localStorage.removeItem('current_expert_review_id');
    localStorage.removeItem('current_order_id');
    localStorage.removeItem('isProceed');
  }

  public get orderCurrentStepNumber(): typeof OrderStepsNumber {
    return OrderStepsNumber;
  }

  back() {
    this.location.back();
  }

  getVehicleProcedureStepNumber(): number {
    if(!this.orderDetail.loan){
      return this.getBuyNowStepNumber() + 1;
    }else{
      return this.getLoanDataStepNumber() + 1;
    }
  }

  getLoanDataStepNumber(): number {
    return this.getBuyNowStepNumber() + 1;
  }

  getBuyNowStepNumber(): number {
    if((this.orderDetail.expert_evaluation?.is_expert_evaluation === null && this.orderDetail.negotiation_details?.is_price_negotiating === null)
      || (this.orderDetail.expert_evaluation?.is_expert_evaluation && this.orderDetail.negotiation_details?.is_price_negotiating)){
      return 6;
    }else if(this.orderDetail.expert_evaluation?.is_expert_evaluation === false && this.orderDetail.negotiation_details?.is_price_negotiating === false){
      return 4;
    }
    return 5;
  }

  getDeliveryStepNumber(): number {
    if (this.orderDetail.vehicle_procedure?.is_vehicle_procedure === false && !this.orderDetail.loan) {
      return this.getBuyNowStepNumber() + 1;
    } else if (this.orderDetail.loan && this.orderDetail.vehicle_procedure.is_vehicle_procedure === false) {
      return this.getLoanDataStepNumber() + 1;
    } else {
      return this.getVehicleProcedureStepNumber() + 1;
    }
  }

  getVehicleReviewStepNumber(): number{
    return this.currentStep > OrderStepsNumber.EXPERT_EVALUATION ? 3 :  4;
  }
}
