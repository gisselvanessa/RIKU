import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrderStages, OrderStepsNumber } from 'src/app/shared/constant/add-order-constants';
import { Order } from '../../buyer-order.model';
import { BuyerOrdersService } from '../../buyer-orders.service';
import { Error } from 'src/app/shared/models/error.model';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from '@angular/router';
import { VehicleProceduleDialogComponent } from '../vehicle-procedure/vehicle-procedule-dialog/vehicle-procedule-dialog.component';
import { CancelOrderDialogComponent } from '../../order-details/cancel-order-dialog/cancel-order-dialog.component';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { TranslateService } from '@ngx-translate/core';
import { faThemeisle } from '@fortawesome/free-brands-svg-icons';


@Component({
  selector: 'app-price-negotiation',
  templateUrl: './price-negotiation.component.html',
  styleUrls: ['./price-negotiation.component.scss']
})

export class PriceNegotiationComponent implements OnInit {

  constructor(private toastr: ToastrService, private modalService: NgbModal, private translate: TranslateService,
    private buyerOrdersService: BuyerOrdersService, private router: Router) { }
  isPriceNegotiated: boolean = false;
  isNegotiateAccepted: boolean = false;
  loading: boolean = false;
  offeredPrice: string;
  completedStep: number = 0;
  isEnabledFields: boolean = true;

  @Input() currentStep: number;
  @Output() onSubmitDetails: EventEmitter<{ orderDetail: Order, nextStep: number }> = new EventEmitter();
  @Input() currentOrder: Order = new Order();

  ngOnInit(): void {
    if (this.currentOrder.negotiation_details?.is_price_negotiating) {
      this.isPriceNegotiated = true;
      this.currentOrder.negotiation_details.negotiated_price = Number(this.currentOrder.negotiation_details.negotiated_price);
      const currentStage: any = this.currentOrder.current_stage.toUpperCase();
      const completedStep: any = this.orderCurrentStepNumber[currentStage];
      this.completedStep = completedStep;
    }
  }

  onSubmit(): void {
    let offeredPrice: any;

    // if (this.offeredPrice.includes(',')) {
    //   offeredPrice = (this.offeredPrice).replace(",", '')
    //   if (offeredPrice.includes('.')) {
    //     offeredPrice = ((offeredPrice).replace(".", ''))
    //   } else {
    //     offeredPrice = offeredPrice
    //   }
    // } else if (this.offeredPrice.includes('.')) {
    //   offeredPrice = ((this.offeredPrice).replace(".", ''))
    //   if (offeredPrice.includes(',')) {
    //     offeredPrice = ((offeredPrice).replace(",", ''))
    //   } else {
    //     offeredPrice = offeredPrice
    //   }
    // } else {
    //   offeredPrice = offeredPrice
    // }
    offeredPrice = this.offeredPrice;
    if(offeredPrice){
      offeredPrice = offeredPrice.replaceAll('.', '');
      offeredPrice = offeredPrice.replaceAll(',', '.');
    }
    if (!offeredPrice || offeredPrice.trim() == '') {
      this.toastr.warning(this.translate.instant('Please enter offer price'));
      return;
    } else {
      //console.log(parseFloat(offeredPrice), this.currentOrder.vehicle.price);
      if (parseFloat(offeredPrice) > this.currentOrder.vehicle.price) {
        this.toastr.warning(this.translate.instant('An offer Price must be less than actual vehicle price'));
        return;
      }
    }
    this.loading = true;
    this.buyerOrdersService.negotiatePrice({
      order_id: this.currentOrder.order_id,
      offered_price: offeredPrice,
      is_price_negotiating: true
    }).subscribe({
      next: () => {
        this.loading = false;
        const negotiation_details: any = {
          order_id: this.currentOrder.order_id,
          negotiated_price: Number(offeredPrice),
          is_price_negotiating: true,
          is_offer_accepted: null
        };
        this.currentOrder.current_stage = this.orderCurrentStage.PRICE_NEGOTIATION;
        this.currentOrder.negotiation_details = negotiation_details;
        this.isPriceNegotiated = true;
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

  setNextStep(currentStep: number = 0): void {
    // if (!this.currentOrder.vehicle_procedure.is_vehicle_procedure) {
      // this.showVehicleProcedureModal()
      // this.submitVehicleProcedureCheck(true);
    // } else {
      this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.BUY_NOW });
    // }
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
          this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.BUY_NOW });
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
      order_id: this.currentOrder.order_id,
      offered_price: this.currentOrder.original_price,
      is_price_negotiating: false
    }).subscribe({
      next: () => {
        this.loading = false;
        const negotiation_details: any = {
          order_id: this.currentOrder.order_id,
          negotiated_price: Number(this.currentOrder.original_price),
          is_price_negotiating: false,
          is_offer_accepted: null
        };
        this.currentOrder.current_stage = this.orderCurrentStage.PRICE_NEGOTIATION;
        this.currentOrder.negotiation_details = negotiation_details;
        this.isPriceNegotiated = false;
        this.setNextStep(this.currentStep + 1)
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

  setPreviousStep() {
    this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: this.currentStep - 1 });
  }
  backOrderList(){
    this.router.navigate([`/user/buyer-orders/order-list`])
    
  }

  public get orderCurrentStage(): typeof OrderStages {
    return OrderStages;
  }

  public get orderCurrentStepNumber(): typeof OrderStepsNumber {
    return OrderStepsNumber;
  }

  cancelOrder() {
    const modalRef = this.modalService.open(CancelOrderDialogComponent, {
      windowClass: 'cancel-order-modal',
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    })
    modalRef.componentInstance.orderId = this.currentOrder.order_id;
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

  formatPrice(event: any) {
    if (event.target.value && event.target.value.trim() != '') {
      const myPrice = event.target.value.toLocaleString('es-US', { style: 'currency' });
      let value = event.target.value.replace(/,/g, '');
      value = Intl.NumberFormat('es').format(value)
      this.offeredPrice = value;
    }
  }

  formatToNumber(event: any) {
    if (event.target.value && event.target.value.trim() != '') {
      let value = event.target.value.replaceAll('.', '');
      value = value.replaceAll(',', '.');
      this.offeredPrice = value;
    }
  }

  enabledFields(): void {
    this.isEnabledFields = !this.isEnabledFields;
  }
}
