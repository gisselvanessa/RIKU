import { Component, OnInit, ViewEncapsulation, ViewChild,SecurityContext } from '@angular/core';
import SwiperCore, { FreeMode, Navigation, Thumbs } from "swiper";
import { VehicleDetailsService } from './view-vehicle-details.service';
import { VehicleDetail } from 'src/app/shared/models/vehicle.model';
import { ArrayHelper } from 'src/app/shared/helpers/array-chunks';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { SwiperGalleryComponent } from 'src/app/shared/modals/swiper-gallery/swiper-gallery.component';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


// install Swiper modules
SwiperCore.use([FreeMode, Navigation, Thumbs]);

@Component({
  selector: 'app-view-seller-vehicle-details',
  templateUrl: './view-vehicle-details.component.html',
  styleUrls: ['./view-vehicle-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ViewSellerVehicleDetailsComponent implements OnInit {
  thumbsSwiper: any;
  vehicleDetail: VehicleDetail = new VehicleDetail();
  vehicleId: string;
  sliderImages: Array<any> = [];
  currentURL: string = '';
  showSharing: boolean = false;

  constructor(private vehicleDetailsService: VehicleDetailsService, private activateroute: ActivatedRoute,
    private toastr: ToastrService, private _location: Location, private translate:TranslateService,
    private modalService: NgbModal,
    private sanitizer:DomSanitizer
  ) { }

  ngOnInit(): void {
    this.vehicleId = this.activateroute.snapshot.paramMap.get('id') || '';
    this.currentURL = window.location.href;

    this.vehicleDetailsService.getVehicleDetails(this.vehicleId)
      .pipe().subscribe(
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
            this.sliderImages = this.vehicleDetail.other_img_urls.map((e: any) => e.url);
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

  getDescription(description:string){
    return this.sanitizer.sanitize(SecurityContext.HTML,description?.replace(/\n/g, '<br>'))
  }

  deleleVehicle(): void {
    try {
      const modalRef = this.modalService.open(DeleteConfirmationComponent, {
        windowClass: 'delete-vehicle-modal '
      })
      modalRef.componentInstance.vehicleId = this.vehicleId;
    } catch (ex) {

    }
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

  openGallery(images: any, index: any) {
    const modalRef = this.modalService.open(SwiperGalleryComponent, {
      windowClass: 'delete-vehicle-modal modal-xl',
    })
    modalRef.componentInstance.swiperImages = images;
    modalRef.componentInstance.index = index;
  }

  goBack(){
    this._location.back();
  }

}
