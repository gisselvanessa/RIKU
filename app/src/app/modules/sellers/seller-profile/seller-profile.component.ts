import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ArrayHelper } from 'src/app/shared/helpers/array-chunks';
import { BecomeBuyerSellerComponent } from 'src/app/shared/modals/become-buyer-seller/become-buyer-seller.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { BuyerVehicleService } from '../../buyers/buyer-vehicle.service';
import { TermsConditionsChatCallComponent } from '../../buyers/buyer-vehicle/terms-conditions-chat-call/terms-conditions-chat-call.component';
import { SellerProfileService } from './seller-profile.service';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.scss']
})
export class SellerProfileComponent implements OnInit {


  constructor(
    private activateroute: ActivatedRoute,
    private buyerVehicleService: BuyerVehicleService,
    private modalService: NgbModal,
    public authService: AuthService,
    private sellerDetailsService: SellerProfileService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private location: Location,
    private userService: UserService
  ) { }
  sellerId: string;
  sellerDetail: any;
  getScreenWidth: any;
  page: any = 1;
  limit: any;
  loading: any = true;
  vehicleListData: any;
  next: any = false;
  previous: any = false;
  favId: any[] = [];
  favVehicleId: any[] = [];
  userType: Array<string>;
  isLoggedIn: boolean = false;
  userSellerBoolean: boolean;
  bSellerModal: NgbModalRef;
  @ViewChild('becomeSeller') openBSellerModal: TemplateRef<any>;
  vehicleDataArray: any;


  ngOnInit(): void {
    this.sellerId = this.activateroute.snapshot.paramMap.get('id') || '';
    // this.authService.isLoggedIn.subscribe((res: any) => {
    //   this.isLoggedIn = res;
    // })
    this.sellerDetailsService.getSellerDetails(this.sellerId).subscribe((resp: any) => {
      this.sellerDetail = resp.data
    })
    this.getFavVehicles()
    this.userType = JSON.parse(localStorage.getItem('type')!)
    if (this.userType.includes('seller')) {
      this.userSellerBoolean = true;
    } else {
      this.userSellerBoolean = false;
    }
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 768) {
      this.limit = 9;
      this.getAllVehicleList({ page: this.page, limit: this.limit });
    } else {
      this.limit = 12;
      this.getAllVehicleList({ page: this.page, limit: this.limit });
    }
  }

  getFavVehicles() {
    this.favId = []
    this.favVehicleId = []
    this.sellerDetailsService.getFavouriteVehicle().subscribe((resp: any) => {
      if (resp.data.length > 0) {
        for (let i = 0; i < resp.data.length; i++) {
          this.favId.push(resp.data[i].id)
          this.favVehicleId.push(resp.data[i].favourite_vehicle_id)
        }
      }
    })
  }

  openContact(typeOfContact: string, userdetails: any) {
    localStorage.setItem('chatUserId', userdetails.id)
    localStorage.setItem('chatUserEmail', this.sellerDetail.email)
    this.buyerVehicleService.getTermsAndConditionData(typeOfContact.toLowerCase(), userdetails.id).subscribe((resp: any) => {
      if (resp && resp.data.is_accepted === false) {
        const modalRef = this.modalService.open(TermsConditionsChatCallComponent, {
          windowClass: 'delete-vehicle-modal modal-lg'
        })

        modalRef.componentInstance.typeOfContact = typeOfContact;
        modalRef.componentInstance.userType = 'Seller';
        modalRef.componentInstance.userId = userdetails.id;
        modalRef.result.catch((result: any) => {
          if (result === 'proceed') {
            if (typeOfContact === 'Chat') {
              this.router.navigate(['/buyer/chat-user']);
            } else if (typeOfContact === 'Call') {
              this.userService.callingDetails = {};
              this.userService.callingDetails.id = userdetails.id;
              this.userService.callingDetails.type = 'seller';
              this.userService.callingDetails.mobile_no = userdetails.mobile_no
              this.userService.callingDetails.country_code = userdetails.country_code;
              this.userService.callingDetails.first_name = userdetails.first_name;
              this.userService.callingDetails.last_name = userdetails.last_name;
              this.userService.callingDetails.profile_pic = userdetails.profile_image_url;
              setTimeout(() => {
                this.router.navigate(['/buyer/call']);
              }, 300)
            }
          }
        })
      } else {
        if (typeOfContact === 'Chat') {
          this.router.navigate(['/buyer/chat-user']);
        } else if (typeOfContact === 'Call') {
          this.userService.callingDetails = {};
          this.userService.callingDetails.id = userdetails.id;
          this.userService.callingDetails.type = 'seller';
          this.userService.callingDetails.mobile_no = userdetails.mobile_no
          this.userService.callingDetails.country_code = userdetails.country_code;
          this.userService.callingDetails.first_name = userdetails.first_name;
          this.userService.callingDetails.last_name = userdetails.last_name;
          this.userService.callingDetails.profile_pic = userdetails.profile_image_url;
          setTimeout(() => {
            this.router.navigate(['/buyer/call']);
          }, 300)
        }
      }
    })

  }

  getAllVehicleList(param_filter: any): void {
    this.loading = true;
    this.sellerDetailsService.getVehicleList(this.sellerId, param_filter).subscribe((res: any) => {
      this.vehicleListData = res.data;
      this.vehicleDataArray = ArrayHelper.getArrayChunks(this.vehicleListData.items, 3)
      if (this.vehicleListData.pagination.total_pages > 1) {
        this.next = true;
      }
      this.loading = false;
    },
      ({ error, status }) => {
        this.loading = false;
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant("Something Went Wrong Please Try again later")
          this.toastr.error(message);
        }
      });
  }

  jumpToThePage(page: number) {
    this.page = page;
    this.getAllVehicleList({ page: this.page, limit: this.limit });
  }

  // paginationForwardPrevious(next: any, pre: any) {
  //   if (next && this.page < this.vehicleListData.pagination.total_pages) {
  //     this.next = true;
  //     this.previous = false;
  //     this.page++;
  //     this.getAllVehicleList({ page: this.page, limit: this.limit });
  //   }
  //   if (pre && this.page > 1) {
  //     this.next = false;
  //     this.previous = true;
  //     this.page--;
  //     this.getAllVehicleList({ page: this.page, limit: this.limit });
  //   }
  // }

  handleMissingImage(event: Event) {
    (event.target as HTMLImageElement).src = 'https://devjak-images.s3.amazonaws.com/vehicles/car.png';
  }

  favVehicle(firstIndex: any, secondIndex: any) {
    if (this.favVehicleId.includes(this.vehicleDataArray[firstIndex][secondIndex].id)) {
      let i = this.favVehicleId.indexOf(this.vehicleDataArray[firstIndex][secondIndex].id)
      this.sellerDetailsService.deletFavouriteVehicle(this.favId[i]).subscribe((resp: any) => {
        if (resp.success_code === 'REMOVED_FAVOURITE_VEHICLE') {
          this.favVehicleId.splice(i, 1)
          this.favId.splice(i, 1)
        }
      })

    }
    else {
      this.sellerDetailsService.postFavouriteVehicle(this.vehicleDataArray[firstIndex][secondIndex].id).subscribe((resp: any) => {
        this.favVehicleId.push(this.vehicleDataArray[firstIndex][secondIndex].id)
        this.favId.push(resp.data.id)
      })
    }

  }

  goback() {
    this.location.back()
  }


  openBseller() {
    const modalRef = this.modalService.open(BecomeBuyerSellerComponent, {
      windowClass: 'delete-vehicle-modal',
    });
    modalRef.componentInstance.becomeType = 'seller';
    modalRef.result.then().catch((res: any) => {
      if (res) {
        const userType = localStorage.getItem('type');
        if (userType) {
          this.userType = JSON.parse(userType);
          if (this.userType.includes('seller')) {
            this.userSellerBoolean = true;
          } else {
            this.userSellerBoolean = false;
          }
        }
      }
    })
    // this.bSellerModal = this.modalService.open(this.openBSellerModal, { size: 'lg', backdrop: 'static', centered: true })
    // this.bSellerModal.result.catch((result: any) => {
    //   if (result === 'Yes') {
    //     if (!this.authService.isSignedin()) {
    //       this.signup()
    //     } else {
    //       this.router.navigate(['buyer/vehicles/become-seller'])
    //     }
    //   }
    // })

  }

  signup() {
    this.router.navigate(['auth/signup'])
  }
}
