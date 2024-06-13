import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { VehicleDetail } from 'src/app/shared/models/vehicle.model';
import { RejectVehicleConfirmationComponent } from 'src/app/shared/modals/admin/reject-vehicle-confirmation/reject-vehicle-confirmation.component';
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import SwiperCore, { FreeMode, Navigation, Thumbs } from "swiper";
import { AdminVehicleService } from '../admin-vehicles.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { ModuleName, ModulePermissions, UserPermission } from '../../permission.model';
import { SwiperGalleryComponent } from 'src/app/shared/modals/swiper-gallery/swiper-gallery.component';
import { TranslateService } from '@ngx-translate/core';
// install Swiper modules
SwiperCore.use([FreeMode, Navigation, Thumbs]);

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './admin-vehicle-details.component.html',
  styleUrls: ['./admin-vehicle-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class AdminVehicleDetailsComponent implements OnInit {
  thumbsSwiper: any;
  vehicleDetail: VehicleDetail = new VehicleDetail();
  vehicleId: string;
  sliderImages: Array<any> = [];
  currentURL: string = '';
  showSharing: boolean = false;
  currentTab: any = 'overview';
  loading: boolean = false;
  permissionModule: Array<UserPermission>;
  modulePermissions: ModulePermissions = {} as ModulePermissions;
  constructor(
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public location: Location,
    private modalService: NgbModal,
    private adminVehicleService: AdminVehicleService,
    private router: Router,
    private userService: UserService,
    private userPermissionService: UserPermissionService,
    private translate:TranslateService
  ) { }

  ngOnInit(): void {
    this.vehicleId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.currentURL = window.location.href;
    this.userRolePermission();
    this.getVehicleDetails();
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

  getVehicleDetails(){
    this.loading = true;
    this.adminVehicleService
    .getVehicleDetails(this.vehicleId)
    .pipe()
    .subscribe(
      (response: any) => {
        this.loading = false;
        this.vehicleDetail = response.data;
        if (this.vehicleDetail.other_img_urls?.length > 0) {
          this.sliderImages = this.vehicleDetail.other_img_urls.map(
            (e: any) => e.url
          );
        }
        if (this.vehicleDetail.cover_img_url?.key) {
          this.sliderImages.unshift(this.vehicleDetail.cover_img_url.url);
        }
        // let mileage: any = this.vehicleDetail.mileage;
        // this.vehicleDetail.mileage = mileage ? mileage.replaceAll('.', ',') : 0;
      },
      ({ error, status }) => {
        this.loading = false;
        if (error.error[0]) {
          this.toastr.error(error.error[0]);
          this.location.back();
        } else {
          const message = this.translate.instant('Something Went Wrong Please Try again later')
          this.toastr.error(message);
        }
      }
    );
  }

  userRolePermission() {
    // if (this.userService.getUserType() === 'admin') {
    //   this.userPermissionService.getUserPermissions().subscribe((resp: any) => {
    //     this.permissionModule = resp.data.permissions
    //     const moduleNameIndex = this.permissionModule.findIndex((x: any) => x.module_name === 'vehicles')
    //     this.modulePermissions = this.permissionModule[moduleNameIndex].module_permissions
    //   })
    // } else {
    //   this.modulePermissions.can_create = true;
    //   this.modulePermissions.can_delete = true;
    //   this.modulePermissions.can_edit = true;
    //   this.modulePermissions.can_export = true;
    //   this.modulePermissions.can_list = true;
    //   this.modulePermissions.can_view_details = true;
    // }
    if (this.activatedRoute.snapshot.data['modulePermissions']['data']) {
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.VehicleManagement);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }
  }

  deleleVehicle(): void {
    try {
      const modalRef = this.modalService.open(DeleteConfirmationComponent, {
        windowClass: 'delete-vehicle-modal',
      });
      modalRef.componentInstance.vehicleId = this.vehicleId;
      modalRef.componentInstance.isFromAdmin = true;
      const message = this.translate.instant("Back to Vehicle Listing")
      modalRef.componentInstance.deleteSuccessBtnText = message;
    } catch (ex) {

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

  approveRejectVehicle(approveReject: boolean): void {
    // if (approveReject) {
    //   try {
    //     this.adminVehicleService
    //       .approveDisaproveVehicle({
    //         vehicle_id: this.vehicleId,
    //         is_approved: true,
    //       })
    //       .pipe()
    //       .subscribe(
    //         (response: any) => {
    //           this.loading = false;
    //           const modalRef = this.modalService.open(SuccessfullComponent, {
    //             windowClass: 'delete-vehicle-modal',
    //           });
    //           modalRef.componentInstance.approveSuccess = true;
    //         },
    //         (error: any) => {
    //           this.loading = false;
    //           if (error.error[0]) {
    //             this.toastr.error(error.error[0]);
    //           } else {
    //             this.toastr.error('Something Went Wrong Please Try again later');
    //           }
    //         }
    //       );
    //   } catch (ex) {

    //   }
    // } else {
    //   try {

    //   } catch (ex) {

    //   }
    // }

    const modalRef = this.modalService.open(RejectVehicleConfirmationComponent, {
      windowClass: 'delete-vehicle-modal',
    });
    modalRef.componentInstance.vehicleId = this.vehicleId;
    modalRef.componentInstance.approveRejectflg = approveReject;

  }

  selectTab(value: any): void {
    this.currentTab = value;
  }

  goBack(){
    this.location.back();
  }
}
