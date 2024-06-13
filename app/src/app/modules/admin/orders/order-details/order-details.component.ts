import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { OrdersService } from '../orders.service';

import { PaymentConfirmationDialogComponent } from 'src/app/shared/modals/payment-confirmation-dialog/payment-confirmation-dialog.component';
import { Order } from 'src/app/modules/buyers/buyer-orders/buyer-order.model';
import { OrderStepsNumber, VehicleProcedureStepsNumber, VehicleReviewStatus } from 'src/app/shared/constant/add-order-constants';
import { Error } from 'src/app/shared/models/error.model';
import { ModuleName, ModulePermissions } from '../../permission.model';
import { OrderResponse } from '../order.model';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})

export class OrderDetailsComponent implements OnInit {
  modulePermissions: ModulePermissions;
  orderId: string;
  orderDetails: Order;
  loading: boolean = false;
  sliderImages: Array<string> = [];
  currentStep: number;
  sellerType: string;
  canViewVehicleProcedure: boolean = false;
  canViewVehicle: boolean = false;
  procedureCurrentStepNo: number = 0;
  isPaymentReceived: boolean = false;
  orderPrice: number;
  depositAmount: number;

  constructor(private router: Router, private translate: TranslateService, private activatedRoute: ActivatedRoute,
    private toastr: ToastrService, private ordersService: OrdersService, public location: Location,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.orderId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    if (this.activatedRoute.snapshot.data['modulePermissions']['data']) {
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.OrderManagement);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    } else {
      this.modulePermissions = new ModulePermissions();
    }
    const procedureModule = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.ProcedureManagement);
    if (procedureModule) {
      this.canViewVehicleProcedure = procedureModule ? procedureModule.module_permissions?.can_view_details : new ModulePermissions();
    }
    const vehicleModule = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.VehicleManagement);
    if (vehicleModule) {
      this.canViewVehicle = vehicleModule ? vehicleModule.module_permissions?.can_view_details : new ModulePermissions();
    }
    this.getOrderDetail();
  }

  getOrderDetail() {
    if (this.orderId.trim() != '') {
      this.loading = true;
      this.ordersService.orderDetails(this.orderId).subscribe({
        next: (res: OrderResponse) => {
          this.orderDetails = res.data;
          this.sellerType = this.orderDetails.seller.type ? this.orderDetails.seller.type.toString() : 'seller';
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
          if(this.orderDetails.loan){
            this.depositAmount = this.orderPrice - this.orderDetails.loan.amount;
          }
          const orderStage: any = [this.orderDetails.current_stage.toUpperCase()]
          const currentStep: any = OrderStepsNumber[orderStage];
          this.currentStep = currentStep;
          this.loading = false;
        },
        error: (errorRes: Error) => {
          this.loading = false;
          const error = errorRes.error;
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.toastr.error(message);
          }
        }
      })
    }

  }


  public get orderCurrentStepNumber(): typeof OrderStepsNumber {
    return OrderStepsNumber;
  }

  public get vehicleReviewStatus(): typeof VehicleReviewStatus {
    return VehicleReviewStatus;
  }

  public get procedureStepNumber(): typeof VehicleProcedureStepsNumber {
    return VehicleProcedureStepsNumber;
  }

  public confirmPayment(isPaymentReceived: boolean) {
    const modalRef = this.modalService.open(PaymentConfirmationDialogComponent, {
      windowClass: 'payment-confirmation-modal',
    });
    modalRef.componentInstance.orderId = this.orderId;
    modalRef.componentInstance.isReceived = isPaymentReceived;
    modalRef.result.then((isSuccess) => {
      if (isSuccess && isPaymentReceived) {
        this.isPaymentReceived = true;
      } else if (isSuccess && !isPaymentReceived) {
        this.isPaymentReceived = false;
        this.orderDetails.payment.status = 'failed';
      }
    }).catch((error: any) => {
    });

  }

}
