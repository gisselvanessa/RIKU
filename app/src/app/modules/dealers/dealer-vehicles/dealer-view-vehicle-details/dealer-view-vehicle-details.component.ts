import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import SwiperCore, { FreeMode, Navigation, Thumbs } from 'swiper';
import { VehicleDetail } from 'src/app/shared/models/vehicle.model';
import { ArrayHelper } from 'src/app/shared/helpers/array-chunks';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { VehicleDetailsService } from 'src/app/modules/sellers/seller-vehicles/view-vehicle-details/view-vehicle-details.service';
import { DealerVehiclesService } from '../dealer-vehicles.service';
import { SwiperGalleryComponent } from 'src/app/shared/modals/swiper-gallery/swiper-gallery.component';
import { TranslateService } from '@ngx-translate/core';

// install Swiper modules
SwiperCore.use([FreeMode, Navigation, Thumbs]);

@Component({
  selector: 'app-dealer-view-vehicle-details',
  templateUrl: './dealer-view-vehicle-details.component.html',
  styleUrls: ['./dealer-view-vehicle-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class DealerViewVehicleDetailsComponent implements OnInit {
  thumbsSwiper: any;
  vehicleDetail: VehicleDetail = new VehicleDetail();
  vehicleId: string;
  sliderImages: Array<any> = [];
  currentURL: string = '';
  showSharing: boolean = false;

  constructor(
    private vehicleDetailsService: VehicleDetailsService,
    private dealerVehiclesService: DealerVehiclesService,
    private activateroute: ActivatedRoute,
    private toastr: ToastrService,
    public location: Location,
    private modalService: NgbModal,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    
    this.vehicleId = this.activateroute.snapshot.paramMap.get('id') || '';
    this.currentURL = window.location.href;

    this.dealerVehiclesService
      .getVehicle(this.vehicleId)
      .pipe()
      .subscribe(
        (response: any) => {
          setTimeout(()=>{
            window.scroll({
              top: 0,
              left: 0,
              behavior: 'smooth'
            });
          },10)
          this.vehicleDetail = response.data;
          if (this.vehicleDetail.other_img_urls?.length > 0) {
            this.sliderImages = this.vehicleDetail.other_img_urls.map(
              (e: any) => e.url
            );
          }
          if (this.vehicleDetail.cover_img_url.key) {
            this.sliderImages.unshift(this.vehicleDetail.cover_img_url.url);
          }
          // let mileage: any = this.vehicleDetail.mileage;
          // this.vehicleDetail.mileage = mileage ? mileage.replaceAll('.', ',') : 0;
          //this.sliderImages = [];
        },
        ({ error, status }) => {
          if (error.error[0]) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }
      );
  }

  setToDecimal(e: any) {
    const mileageValue = e;
    const decimalPoint = ",";
    const position = 2;
    if (mileageValue.toString().length > 2 && !mileageValue.toString().includes(decimalPoint)) {
      const modifiedMileageValue = [mileageValue.toString().slice(0, position), decimalPoint, mileageValue.toString().slice(position)].join('');
      return modifiedMileageValue
    } else {
      return mileageValue
    }
  }

  handleMissingImage(event: Event) {
    (event.target as HTMLImageElement).src = 'https://devjak-images.s3.amazonaws.com/vehicles/car.png';
  }
  openGallery(images: any, index:any) {
    const modalRef = this.modalService.open(SwiperGalleryComponent, {
      windowClass: 'delete-vehicle-modal modal-xl',
    })
    modalRef.componentInstance.swiperImages = images;
    modalRef.componentInstance.index = index;
  }

  deleleVehicle(): void {
    try {
      const modalRef = this.modalService.open(DeleteConfirmationComponent, {
        windowClass: 'delete-vehicle-modal ',
      });
      modalRef.componentInstance.vehicleId = this.vehicleId;
      modalRef.componentInstance.isFromDealer = true;
      modalRef.componentInstance.deleteSuccessBtnText = 'Back to Vehicle Listing';
    } catch (ex) { }
  }

  goBack(){
    this.location.back();
  }
}
