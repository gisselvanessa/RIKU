import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VehicleDetailsService } from '../../../buyer-vehicle/buyer-vehicle-details/vehicle-details.service';
import { BuyerOrdersService } from '../../buyer-orders.service';
import { OrderStages } from 'src/app/shared/constant/add-order-constants';
import { Order, SellerInformation, Vehicle } from '../../buyer-order.model';



@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss']
})

export class VehicleDetailsComponent implements OnInit, OnChanges {

  constructor(private activateroute: ActivatedRoute, private router: Router, private buyerOrdersService: BuyerOrdersService,
  private vehicleDetailsService: VehicleDetailsService, private toastr: ToastrService) { }
  vehicleId: string;
  vehicleDetail: Vehicle = new Vehicle();
  sellerDetails: SellerInformation = new SellerInformation();
  sliderImages: Array<any> = [];
  @Input() currentStep: number;
  @Output() onSubmitDetails: EventEmitter<{ orderDetail: Order, nextStep: number }> = new EventEmitter();
  @Input() currentOrder: Order = new Order();
  loading: boolean = false;
  sellerType: Array<string> = [];

  ngOnInit(): void {
    this.vehicleDetail = this.currentOrder.vehicle;

    this.vehicleDetail.price = this.currentOrder.original_price;
    if (this.vehicleDetail.other_images?.length > 0) {
      this.sliderImages = this.vehicleDetail.other_images.map((e: any) => e.url);
    }
    if (this.vehicleDetail.primary_image) {
      this.sliderImages.unshift(this.vehicleDetail.primary_image);
    }
    this.sellerDetails = this.currentOrder.seller;
    this.sellerType = this.sellerDetails.type ? this.sellerDetails.type : ['user'];
  }

  ngOnChanges(): void {
    this.vehicleDetail = this.currentOrder.vehicle;
    this.sellerDetails = this.currentOrder.seller;
  }

  submitOrder(): void {
    this.nextStep();
  }
  back(): void {
    this.router.navigate(['/loan/loan-candidate-details'])
  }
  nextStep(): void {
    this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: this.currentStep + 1 });
  }

  public get orderCurrentStage(): typeof OrderStages {
    return OrderStages;
  }
}
