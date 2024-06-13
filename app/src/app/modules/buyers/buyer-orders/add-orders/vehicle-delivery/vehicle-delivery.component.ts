import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { OrderStepsNumber } from '../../../../../shared/constant/add-order-constants';
import { Error } from 'src/app/shared/models/error.model';
import { Order } from '../../buyer-order.model';
import { BuyerOrdersService } from '../../buyer-orders.service';

@Component({
  selector: 'app-vehicle-delivery',
  templateUrl: './vehicle-delivery.component.html',
  styleUrls: ['./vehicle-delivery.component.scss']
})

export class VehicleDeliveryComponent implements OnInit {

  @Input() currentStep: number;
  @Output() onSubmitDetails: EventEmitter<{orderDetail: Order, nextStep: number}> = new EventEmitter();
  @Input() currentOrder: Order;
  deliveryStatus: string;
  isSubmitted: boolean = false;
  loading:boolean = false;
  constructor(private buyerOrdersService: BuyerOrdersService, private toastr: ToastrService,
    private router: Router, private translate: TranslateService) { }

  ngOnInit(): void {
  }

  submitDeliveryStatus(): void{
    this.isSubmitted = true;
    if(this.deliveryStatus == '' || !this.deliveryStatus){
      return;
    }
    const data = {
      order_id: this.currentOrder.order_id,
      is_delivered: this.deliveryStatus == 'delivered' ? true : false
    }
    this.loading = true;
    this.buyerOrdersService.confirmDelivery(data).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/buyer/orders']);
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

  setPreviousStep(){
    if(this.currentOrder.vehicle_procedure.is_vehicle_procedure){
      this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.VEHICLE_PROCEDURE });
    }else{
      this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.BUY_NOW });
    }
  }
}
