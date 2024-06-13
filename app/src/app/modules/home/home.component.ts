import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { UserService } from 'src/app/shared/services/user.service';
import SwiperCore, { Navigation, Autoplay } from "swiper";
import { AuthService } from '../../shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { SwiperComponent } from 'swiper/angular';

SwiperCore.use([Navigation, Autoplay]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {
  thumbsSwiper: any;
  user: any;
  loading: any = true;
  page: number = 1;
  limit: any;
  next: any = false;
  previous: any = false;
  getScreenWidth: any;
  homePageDetails: any;
  searchData: any = {};
  province: any;
  selectedProvince: any
  vehicleProvinceClone: any;
  modelList: Array<any> = [];
  modelListClone: Array<any> = [];
  selectedModel: any;
  priceRangeOptions = [{ val: '$10K - $50K', min: 10, max: 50 }, { val: '$51K - $200K', min: 51, max: 200 }, { val: '$201K - $500K', min: 201, max: 500 }, { val: '$501K - $1000K', min: 501, max: 1000 }, { val: '$1001K - $10000K', min: 1001, max: 10000 }, { val: '$10001K - $50000K', min: 10001, max: 50000 }, { val: 'Other', min: 0, max: 10000000 }]
  selectedPriceRange: any
  pagination = {
    clickable: true,
    render: function (index: any, className: any) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  };
  isAdmin: boolean = false;
  swiperBrand: any = {
    slidesPerView: 5,
    speed: 1000,
    direction: 'horizontal',
    mousewheel:
    {
      invert: true,
    },
    breakpoints: {
      '0': {
        slidesPerView: 1,

      },
      '576': {
        slidesPerView: 2,

      },
      '768': {
        slidesPerView: 3,

      },
      '1200': {
        slidesPerView: 5,

      }
    },
    autoplay:
    {
      delay: 2000,
    },
    loop: false,
  }
  swiperReview: any = {
    breakpoints: {
      '0': {
        slidesPerView: 1,

      },
      '576': {
        slidesPerView: 2,

      },
      '991': {
        slidesPerView: 3,

      }

    },
    loop: false,
  }
  swiperCar: any = {
    slidesPerView: 3,
    speed: 2000,
    direction: 'horizontal',
    mousewheel:
    {
      invert: true,
    },
    breakpoints: {
      '0': {
        slidesPerView: 1,
      },
      '576': {
        slidesPerView: 2,
      },
      '992': {
        slidesPerView: 3,
      },
      '1200': {
        slidesPerView: 4,
      },
      '1400': {
        slidesPerView: 5,
      },
    },
    autoplay:
    {
      delay: 1000,
    },
    loop: false,
  }
  swiperUsedCars: any = {
    speed: 3000,
    direction: 'horizontal',
    mousewheel:
    {
      invert: true,
    },
    breakpoints: {
      '0': {
        slidesPerView: 1,
      },
      // '576': {
      //   slidesPerView: 2,

      // },
      // '768': {
      //   slidesPerView: 2,
      // },
      '992': {
        slidesPerView: 2,
      },
      // '1200': {
      //   slidesPerView: 4,
      // },
      '1400': {
        slidesPerView: 3,
      },
    },
    autoplay:
    {
      delay: 2000,
      disableOnInteraction: false,
    },
    loop: false,
  }
  swiperNewCars: any = {
    speed: 3000,
    direction: 'horizontal',
    mousewheel:
    {
      invert: true,
    },
    breakpoints: {
      '0': {
        slidesPerView: 1,
      },
      // '576': {
      //   slidesPerView: 2,

      // },
      // '768': {
      //   slidesPerView: 2,
      // },
      '992': {
        slidesPerView: 2,
      },
      // '1200': {
      //   slidesPerView: 4,
      // },
      '1400': {
        slidesPerView: 3,
      },
    },
    autoplay:
    {
      delay: 2000,
      disableOnInteraction: false,
    },
    loop: false,
  }
  totalModelPages: number = 1;
  currentPage: number = 1;
  screenWidth: number;
  vehiclesAds: any[];
  usedVehiclesAds: any[];
  dealerRoleId: number = 5;
  sellerRoleId: number = 3;
  @ViewChild(SwiperComponent) swiper?: SwiperComponent;

  
  constructor(private authService: AuthService, private router: Router,
    private userService: UserService, private toastr: ToastrService,
    private translate: TranslateService) {
      this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.getVehiclesByRoleId(this.dealerRoleId);
    this.getVehiclesByRoleId(this.sellerRoleId);
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 768) {
      this.limit = 10;
    } else {
      this.limit = 15;
    }
    const isSignIn = this.authService.isSignedin();
    this.authService.changeLoggedIn(isSignIn);
    localStorage.removeItem('vehicleObj');
    const userType = this.userService.getUserType();
    this.isAdmin = userType == 'admin' || userType == 'super_admin' ? true : false;
    this.authService.homePageDetails().subscribe({
      next: (resp: any) => {
        this.homePageDetails = resp.data;
        this.getProvince();
        this.getModels();
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error('Something Went Wrong Please Try again later');
        }
      }
    })
  }

  navigateToListing() {
    const isSignIn = this.authService.isSignedin();
    if (isSignIn) {
      const userType: any = this.userService.getUserType();
      this.router.navigate([`/${userType}/vehicles`]);
    } else {
      this.router.navigate([`/buyer/vehicles`])
    }
  }

  sendItToFinancing(){
    const isSignIn = this.authService.isSignedin();
    if (isSignIn) {
      this.router.navigate([`/loan/financing`]);
    } else {
      this.toastr.error(this.translate.instant('Please sign in to check the eligibility'))
      this.router.navigate([`/auth/login`])
    }
  }

  searchInput(event: any, filterKey: string) {
    if (filterKey == 'location') {
      this.province = this.vehicleProvinceClone;
      if (event.target.value != '') {
        this.province = this.vehicleProvinceClone.filter((x: any) => x.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
      } else {
        this.province = this.vehicleProvinceClone;
      }
    } else if (filterKey == 'model') {
      if (event.target.value != '') {
        this.modelList = this.modelListClone.filter((x: any) => x.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
      } else {
        this.modelList = Object.assign([], this.modelListClone);
      }
    }

  }

  search() {
    if (this.selectedModel != null) {
      for (let i = 0; i < this.modelList.length; i++) {
        if (this.modelList[i].model == this.selectedModel) {
          this.searchData.models = this.modelList[i].id
        }
      }
    }
    if (this.selectedProvince != null) {
      this.searchData.location = this.selectedProvince
    }
    if (this.selectedPriceRange != null) {
      for (let i = 0; i < this.priceRangeOptions.length; i++) {
        if (this.selectedPriceRange === this.priceRangeOptions[i].val) {
          this.searchData.price_min = this.priceRangeOptions[i].min
          this.searchData.price_max = this.priceRangeOptions[i].max
        }
      }
    }
    this.searchData.page = this.page;
    this.searchData.limit = this.limit;
    localStorage.setItem('searchData', JSON.stringify(this.searchData))
    setTimeout(() => {
      const isSignIn = this.authService.isSignedin();
      if (isSignIn) {
        const userType: any = this.userService.getUserType();
        this.router.navigate([`/${userType}/vehicles`]);
      } else {
        this.router.navigate([`/buyer/vehicles`])
      }
    }, 500);
  }


  public getProvince() {
    this.authService.getProvinceList().subscribe((res: any) => {
      this.province = res.data;
      this.vehicleProvinceClone = res.data
    },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      });
  }

  public getModels(curreentPage=1) {
    this.loading = true;
    this.authService.getModelList(curreentPage, this.limit).subscribe((res: any) => {
      this.loading = false;
      if (res.data && res.data.items) {
        res.data.items.forEach(item => {
          this.modelList.push(item);
          this.modelListClone.push(item);
        });
        this.totalModelPages = res.data.pagination.total_pages;
        this.currentPage = curreentPage;
      }
      // this.modelList = res.data ? res.data : [];
      // this.modelListClone = res.data ? res.data : [];
    },
      ({ error, status }) => {
        this.loading = false;
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      });
  }

  public getVehiclesByRoleId(roleId: number) {
    this.authService.getVehiclesByRoleId(roleId).subscribe((res: any) => {
      if(roleId==5){
        this.vehiclesAds = res.data;
      }
      else if(roleId ==3){
        this.usedVehiclesAds = res.data;
      }
    },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      });
  }
}
