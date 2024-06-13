import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation,SecurityContext  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import SwiperCore, { A11y, FreeMode, Navigation, Pagination, Scrollbar, Thumbs } from "swiper";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { VehicleDetail } from 'src/app/shared/models/vehicle.model';
import { VehicleDetailsService } from './vehicle-details.service';

import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';


import { SwiperGalleryComponent } from 'src/app/shared/modals/swiper-gallery/swiper-gallery.component';
import { TermsConditionsChatCallComponent } from '../terms-conditions-chat-call/terms-conditions-chat-call.component';
import { BuyerVehicleService } from '../../buyer-vehicle.service';
import { BuyerOrdersService } from '../../buyer-orders/buyer-orders.service';
import { OrderStages } from 'src/app/shared/constant/add-order-constants';
import { Error } from 'src/app/shared/models/error.model';
import { LoanConstansts } from 'src/app/modules/loan-procedure/loan-constants';
import { VehicleTypes } from 'src/app/shared/constant/add-vehicle-constants';
import { TranslateService } from '@ngx-translate/core';
import { ComingSoonComponent } from 'src/app/shared/modals/coming-soon/coming-soon.component';
import { BecomeBuyerSellerComponent } from 'src/app/shared/modals/become-buyer-seller/become-buyer-seller.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ShareService  } from 'ngx-sharebuttons';
import { UserDetails } from 'src/app/shared/models/user-details.model';

// install Swiper modules
// SwiperCore.use([FreeMode, Navigation, Thumbs]);
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, FreeMode, Thumbs]);

@Component({
  selector: 'app-buyer-vehicle-details',
  templateUrl: './buyer-vehicle-details.component.html',
  styleUrls: ['./buyer-vehicle-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class BuyerVehicleDetailsComponent implements OnInit {

  thumbsSwiper: any;
  @ViewChild('terms') openTC: TemplateRef<any>;
  @ViewChild('sellerTerms') openSellerTermsModal: TemplateRef<any>;

  vehicleDetail: VehicleDetail = new VehicleDetail();
  vehicleId: string;
  sliderImages: Array<any> = [];
  recommendedVehicleList: any[] = [];
  currentURL: string = '';
  showSharing: boolean = false;
  minDepositAmount: number = 0;
  maxDepositAmount: number = 0;
  depositAmount: number = 0;
  minEMIMonth: number = 1;
  sellerDetails: any;
  userId: any;
  termsModal: any;
  showHeart: boolean;
  contactModal: any;
  chatModal: any;
  sellerTermsModal: any;
  selectedTab: string = 'Overview'
  bSellerModal: NgbModalRef;
  isLoggedIn: boolean = false;
  favVehicleId: Array<string> = [];
  userType: Array<string>;
  userSellerBoolean: boolean = false;
  userProfileType: string;
  favVehileCount:number
  selectedLoanType: string = 'variable';
  depositeSliderOptions: Options = {
    floor: 0,
    ceil: 100,
    step: 100,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '$' + Intl.NumberFormat("es").format(value);
        case LabelType.High:
          return '$' + Intl.NumberFormat("es").format(value);
        default:
          return '$' + Intl.NumberFormat("es").format(value);
      }
    },
    enforceStep: false,
    enforceRange: false,
  };

  depositeOptions: Options = {
    floor: 30,
    ceil: 95,
    step: 1,
    translate: (value: number, label: LabelType): string => {
      return value + '%';
      // switch (label) {
      //   case LabelType.Low:
      //     return value + '%';
      //   case LabelType.High:
      //     return Intl.NumberFormat("es").format(value) + '%';
      //   default:
      //     return Intl.NumberFormat("es").format(value) + '%';
      // }
    }
  }

  month:any = this.translate.instant("Month")
  months:any = this.translate.instant("Months")
  emiMonthOptions: Options = {
    floor: 1,
    ceil: 72,
    step: 1,
    translate: (value: number, label: LabelType): string => {
      return value == 1 ? value + ` ${this.month}`  : value + ` ${this.months}` ;
      // switch (label) {
      //   case LabelType.Low:
      //     return Intl.NumberFormat("es").format(value);
      //   case LabelType.High:
      //     return Intl.NumberFormat("es").format(value);
      //   default:
      //     return Intl.NumberFormat("es").format(value);
      // }
    }
  }
  favId: string = '';
  recommendfavId: string[] = [];
  recommendfavVehicleId: string[] = [];
  loading: boolean = false;
  isPopUpOpened: boolean = false;
  isMyVehicle: boolean = false;
  loanInterestRest: number;
  loanAmount: number = 0;
  monthlyEMIValue: number = 0;
  totalEMI: number = 1;
  depositePercentage: number = LoanConstansts.MIN_DEPOSIT;

  constructor(private vehicleDetailsService: VehicleDetailsService, private buyerVehicleService: BuyerVehicleService, private activateroute: ActivatedRoute,
    private toastr: ToastrService, private modalService: NgbModal, public activeModal: NgbActiveModal, public authService: AuthService,
    public userService: UserService, private router: Router, private location: Location,
    private buyerOrdersService: BuyerOrdersService, private translate: TranslateService,
    private sanitizer:DomSanitizer,
    private share: ShareService
  ) { }

  ngOnInit(): void {
    this.getProfile();
    this.activateroute.params.subscribe((routeParams: any) => {
      this.setPageData(routeParams.id);
    });
  }

  getProfile(){
    // this.userService.getMyProfileDetails().subscribe((resp: any) => {
    //   this.userId = resp.data;
    // });
    this.userId = localStorage.getItem('userId');
    console.log(this.userId);
    
  }
  setPageData(vehicleId: any){
    localStorage.removeItem('current_order_id');
    this.vehicleId = vehicleId;
    this.vehicleDetailsService.publishVehicleId(this.vehicleId);
    this.currentURL = window.location.href;
    this.getVehicleDetails();
    this.isLoggedIn = this.authService.isSignedin();
    const userType = localStorage.getItem('type');
    if (userType) {
      this.userType = JSON.parse(userType);
      if (this.userType.includes('seller')) {
        this.userSellerBoolean = true;
      } else {
        this.userSellerBoolean = false;
      }
    }
    if(this.isLoggedIn){
      this.getFavouriteVehicle();
    }
  }

  getFavouriteVehicle() {
    this.favId = '';
    this.favVehicleId = []
    this.vehicleDetailsService.getFavouriteVehicle().subscribe((resp: any) => {
      if (resp.data.length > 0) {
        for (let i = 0; i < resp.data.length; i++) {
          this.favId = (resp.data[i].id)
          this.favVehicleId.push(resp.data[i].favourite_vehicle_id)
        }
        if (this.favVehicleId.includes(this.vehicleId)) {
          this.showHeart = true
        } else {
          this.showHeart = false
        }
      }
    })
  }

  changeVehicle(id: any) {
    this.vehicleId = id;
    // this.ngOnInit();
    // this.getVehicleDetails();
    // this.getFavouriteVehicle();
    this.router.navigate([`/user/vehicles/vehicle-details/${this.vehicleId}`])
  }

  getVehicleDetails() {
    this.vehicleDetailsService.getVehicleDetails(this.vehicleId)
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
          this.minDepositAmount = ((LoanConstansts.MIN_DEPOSIT / 100) * this.vehicleDetail.price);
          this.maxDepositAmount = ((LoanConstansts.MAX_DEPOSIT / 100) * this.vehicleDetail.price);
          this.depositeSliderOptions = { ...this.depositeSliderOptions, minLimit: this.minDepositAmount, maxLimit: this.maxDepositAmount, floor: 0, ceil: this.vehicleDetail.price }
          this.favVehileCount = this.vehicleDetail.favorite_vehicle_count;
          this.sellerDetails = response.data.seller_details;
          this.isMyVehicle = this.userId == this.sellerDetails.id ? true : false //  check if user is seller

          this.userService.callingDetails = response.data.seller_details;
          this.userProfileType = this.sellerDetails.type;

          let recommendVariablesParams = {
            makes: response.data.make_id,
            models: response.data.model_id,
            page: 1,
            limit: 10
          }
          this.getRecommendedVehicles(recommendVariablesParams)
          this.setLoanInterestRate(this.vehicleDetail.vehicle_type);
          if (this.vehicleDetail.other_img_urls?.length > 0) {
            this.sliderImages = this.vehicleDetail.other_img_urls.map((e: any) => e.url);
          }
          if (this.vehicleDetail.cover_img_url) {
            this.sliderImages.unshift(this.vehicleDetail.cover_img_url.url);
          }

          // let mileage: any = this.vehicleDetail.mileage;
          // this.vehicleDetail.mileage = mileage ? mileage.replaceAll('.', ',') : 0;
        },
        ({ error, status }) => {
          if (error && error.error[0]) {
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

  setLoanInterestRate(vehicleType: string) {
    switch (vehicleType) {
      case VehicleTypes.Automobiles:
        this.emiMonthOptions = { ...this.emiMonthOptions, ceil: 60 };
        this.loanInterestRest = LoanConstansts.CAR_AUTOMOBILE_INTEREST_RATE;
        break;
      case VehicleTypes.WorkMachinery:
        this.loanInterestRest = LoanConstansts.HEAVY_VEHICLE_INTEREST_RATE;
        break;
      case VehicleTypes.Buses:
        this.loanInterestRest = LoanConstansts.HEAVY_VEHICLE_INTEREST_RATE;
        break;
      case VehicleTypes.Heavy:
        this.loanInterestRest = LoanConstansts.HEAVY_VEHICLE_INTEREST_RATE;
        break;
      default:
        break;
    }
    this.calculateEMI(this.depositePercentage, 'deposit');
  }

  selectTab(e: any) {
    this.selectedTab = e;
  }

  openUserDetails(id: any) {
    if (this.authService.isSignedin()) {
      if (this.userProfileType === 'seller') {
        this.router.navigate([`seller/seller-profile/${id}`])
      } else if (this.userProfileType === 'dealer') {
        this.router.navigate([`dealer/dealer-profile/${id}`])
      }
    } else {
      this.router.navigate([`auth/login`]);
    }
  }

  openTerms() {
    this.termsModal = this.modalService.open(this.openTC, { size: 'lg', backdrop: 'static', centered: true })
  }

  openContact(typeOfContact: string, userId: string, type: string, email: string) {
    this.isLoggedIn = this.authService.isSignedin();
    if (this.isLoggedIn) {
      localStorage.setItem('chatUserId', userId)
      localStorage.setItem('chatUserEmail', email)
      this.buyerVehicleService.getTermsAndConditionData(typeOfContact.toLowerCase(), userId).subscribe((resp: any) => {
        const isAccepted = resp.data.is_accepted
        if (isAccepted === false) {
          if (this.isPopUpOpened) {
            return;
          } else {
            this.isPopUpOpened = true
            const modalRef = this.modalService.open(TermsConditionsChatCallComponent, {
              windowClass: 'delete-vehicle-modal modal-lg'
            })
            modalRef.componentInstance.typeOfContact = typeOfContact
            modalRef.componentInstance.userId = userId
            modalRef.componentInstance.userType = this.sellerDetails.type
            modalRef.result.catch((result: any) => {
              this.isPopUpOpened = false;
              if (result === 'proceed') {
                if (typeOfContact === 'Chat') {
                  this.router.navigate(['/user/chat-user']);
                } else if (typeOfContact === 'Call') {
                  this.router.navigate(['/user/call']);
                }
              }
            })
          }
        } else {
          if (typeOfContact === 'Chat') {
            this.router.navigate(['/user/chat-user']);
          } else if (typeOfContact === 'Call') {
            this.router.navigate(['/user/call']);
          }
        }
      })
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  favVehicle() {
    if (this.showHeart) {
      for (let i = 0; i < this.favVehicleId.length; i++) {
        if (this.favVehicleId[i] === this.vehicleId) {
          this.vehicleDetailsService.deletFavouriteVehicle(this.favId).subscribe((resp: any) => {
            if (resp.success_code === 'REMOVED_FAVOURITE_VEHICLE') {
              this.showHeart = !this.showHeart
              this.favVehileCount = resp.data.favorite_vehicle_count
              // this.getVehicleDetails()
            }
          })
        }
      }
    }
    else {
      this.vehicleDetailsService.postFavouriteVehicle(this.vehicleId).subscribe((resp:any) => {
        this.getFavouriteVehicle()
        // this.getVehicleDetails()
        this.favVehileCount = resp.data.favorite_vehicle_count
      })
    }

  }

  recommendfavVehicle(index: any) {
    if (this.recommendfavVehicleId.includes(this.recommendedVehicleList[index].id)) {
      let i = this.recommendfavVehicleId.indexOf(this.recommendedVehicleList[index].id);
      this.buyerVehicleService.deletFavouriteVehicle(this.recommendfavId[i]).subscribe((resp: any) => {
        if (resp.success_code === 'REMOVED_FAVOURITE_VEHICLE') {
          this.recommendfavVehicleId.splice(i, 1)
          this.recommendfavId.splice(i, 1)
        }
      })
    }
    else {
      this.buyerVehicleService.postFavouriteVehicle(this.recommendedVehicleList[index].id).subscribe((resp: any) => {
        this.recommendfavVehicleId.push(this.recommendedVehicleList[index].id)
        this.recommendfavId.push(resp.data.id)
      })
    }
  }

  openSellerTerms() {
    this.sellerTermsModal = this.modalService.open(this.openSellerTermsModal, { size: 'lg', backdrop: 'static', centered: true , windowClass:"set-close-icon" })
  }

  openBseller() {
    this.isLoggedIn = this.authService.isSignedin();
    if (this.isLoggedIn) {
      const modalRef= this.modalService.open(BecomeBuyerSellerComponent, {
        windowClass: 'delete-vehicle-modal',
      });
      modalRef.componentInstance.becomeType = 'seller';
      modalRef.result.then().catch((res: any) => {
        if(res){
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
    }else{
      this.router.navigate(['/auth/login']);
    }

  }

  signup() {
    this.router.navigate(['auth/signup'])
  }

  back() {
    this.location.back();
  }

  policy(e: any) {
    this.router.navigate([`user/vehicles/policies/${e}`])
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

  productSlider: any = {
    spaceBetween: 25,
    speed: 1000,
    direction: 'horizontal',
    navigation:
    {
      prevEl: '.swiper-button-prev',
      nextEl: '.swiper-button-next',
    },
    loop: true,
    breakpoints: {
      '0': {
        slidesPerView: 1,

      },
      '768': {
        slidesPerView: 2,

      },
      '1200': {
        slidesPerView: 3,
      }
    },

  }

  public buyNow() {
    if (this.isLoggedIn) {
      this.loading = true;
      this.buyerOrdersService.postOrder({ vehicle_id: this.vehicleId, current_stage: this.orderCurrentStage.PLACED })
        .subscribe({
          next: (res: any) => {
            this.loading = false;
            localStorage.setItem('current_order_id', res.data.order_id);
            this.router.navigate([`/user/buyer-orders/add-order/${res.data.order_id}`]);
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
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  getRecommendedVehicles(param_filter: any) {
    this.buyerVehicleService.getAllVehicle(param_filter).subscribe((res: any) => {
      this.recommendedVehicleList = res.data.items ? res.data.items : [];
      const index = this.recommendedVehicleList.findIndex((data: any) => data.id == this.vehicleId)
      if (index > -1) {
        this.recommendedVehicleList.splice(index, 1);
      }
    },
      ({ error }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    );
    if(this.isLoggedIn){
      this.recommendfavId = []
      this.recommendfavVehicleId = []
      this.buyerVehicleService.getFavouriteVehicle().subscribe((resp: any) => {
        if (resp.data.length > 0) {
          for (let i = 0; i < resp.data.length; i++) {
            this.recommendfavId.push(resp.data[i].id)
            this.recommendfavVehicleId.push(resp.data[i].favourite_vehicle_id)
          }
        }
      })
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

  public get orderCurrentStage(): typeof OrderStages {
    return OrderStages;
  }




  calculateEMI(value: number = 0, valueOf: string = '') {
    if (valueOf === 'deposit') {
      this.depositePercentage = value;
    } else if (valueOf === 'emi_months') {
      this.totalEMI = value;
    }
    this.depositAmount = (this.depositePercentage / 100) * this.vehicleDetail.price;
    this.loanAmount = this.vehicleDetail.price - this.depositAmount;
    this.monthlyPayment((this.loanInterestRest / 100), this.totalEMI, this.loanAmount);
  }

  monthlyPayment(interestRate, loanPeriod, loanAmount) {
    if(this.selectedLoanType == 'fixed'){
      this.monthlyEMIValue = this.perMonthEMI(interestRate / 12, loanPeriod, - loanAmount, 0, 0);
    }else{
      this.monthlyEMIValue = loanAmount / loanPeriod + loanAmount * (interestRate / 12);
    }
  }

  perMonthEMI(rate_per_period, number_of_payments, present_value, future_value = 0, type = 0) {
    if (rate_per_period != 0.0) {
      // Interest rate exists
      let q = Math.pow(1 + rate_per_period, number_of_payments);
      return -(rate_per_period * (future_value + q * present_value)) / ((-1 + q) * (1 + rate_per_period * type));
    }
    if (number_of_payments != 0.0) {
      // No interest rate, but number of payments exists
      return -(future_value + present_value) / number_of_payments;
    }
    return 0;
  }

  purchaseWithLoan() {
    if (this.isLoggedIn) {
      localStorage.setItem('current_vehicle_id', this.vehicleDetail.id);
      this.vehicleDetailsService.currentVehicle = this.vehicleDetail;
      this.router.navigate(['/loan/pre-approval']);
    }else {
      this.router.navigate(['/auth/login']);
    }
  }

  selectLoanType(laonType: string) {
    this.selectedLoanType = laonType;
    this.calculateEMI();
  }

  comingSoon() {
    const modalRef = this.modalService.open(ComingSoonComponent, {
      windowClass: 'delete-vehicle-modal'
    })
  }

  copyToClipboard() {
    const texto = this.currentURL;
    navigator.clipboard.writeText(texto)
      .then(() => {
        this.toastr.success('Copiado al portapapeles');
      })
      .catch(err => {
        this.toastr.error('Error al copiar al portapapeles');
      });
  }
}
